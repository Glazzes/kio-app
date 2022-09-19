import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {withKeyboard} from '../../utils/hoc';
import {Screens} from '../../enums/screens';
import {Notification} from '../../enums/notification';
import {Canvas, RoundedRect, Shadow} from '@shopify/react-native-skia';

type CreateFolderModalProps = {
  parentComponentId?: string;
  parentFolderId?: string;
  folderNames?: string[];
};

const {width} = Dimensions.get('window');
const MODAL_WIDTH = width * 0.75;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CreateFolderModal: NavigationFunctionComponent<
  CreateFolderModalProps
> = ({componentId}) => {
  const ref = useRef<TextInput>(null);

  const [folderName, setFolderName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);
  const [folderExists, setFolderExists] = useState<boolean>(false);

  const toggle = () => setSelected(s => !s);

  const clear = () => {
    if (!loading) {
      ref.current?.clear();
      setFolderName('');
    }
  };

  const onChangeText = (text: string): void => {
    setFolderName(text);
  };

  const focus = () => {
    ref.current?.focus();
  };

  const create = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Navigation.dismissModal(componentId);
      Navigation.showOverlay({
        component: {
          name: Screens.TOAST,
          passProps: {
            title: 'Folder created!',
            message: `Folder "${folderName}" was created successfully`,
            type: Notification.ERROR,
          },
        },
      });
    }, 3000);
  };

  const hideModal = () => {
    Keyboard.dismiss();
    Navigation.dismissModal(componentId);
  };

  const scale = useSharedValue<number>(0);
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  useEffect(() => {
    scale.value = withDelay(
      100,
      withTiming(
        1,
        {
          duration: 300,
          easing: Easing.bezierFn(0.34, 1.56, 0.64, 1), // https://easings.net/#easeOutBack
        },
        hasFinished => {
          if (hasFinished) {
            runOnJS(focus)();
          }
        },
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <Animated.View style={rStyle}>
        <View style={styles.modalContainer}>
          <Canvas style={styles.canvas}>
            <RoundedRect
              x={(width * 0.25) / 2}
              y={15}
              width={MODAL_WIDTH}
              height={160}
              color={'#fff'}
              r={10}>
              <Shadow dx={13} dy={13} blur={13} color={'rgba(0, 0, 0, 0.2)'} />
            </RoundedRect>
          </Canvas>

          <View style={styles.modal}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>New Folder</Text>
              <Image
                source={require('./assets/folder.png')}
                resizeMode={'contain'}
                style={styles.image}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                ref={ref}
                editable={!loading}
                style={styles.input}
                placeholder={'Folder name'}
                keyboardType={'default'}
                onFocus={toggle}
                onChangeText={onChangeText}
              />
              {folderName.length > 0 && (
                <AnimatedPressable
                  onPress={clear}
                  entering={ZoomIn.duration(200)}
                  exiting={ZoomOut.duration(200)}
                  style={styles.icon}>
                  <Icon
                    name={'plus'}
                    size={18}
                    color={'#fff'}
                    style={{transform: [{rotate: '45deg'}]}}
                  />
                </AnimatedPressable>
              )}
            </View>
            {folderExists && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={styles.error}>
                * A folder with this name already exists
              </Animated.Text>
            )}
            <View style={styles.buttonContainer}>
              <Pressable
                style={
                  loading
                    ? [styles.button, styles.cancelDisabled]
                    : [styles.button, styles.cancelButton]
                }
                onPress={hideModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={
                  loading
                    ? [styles.button, styles.createDisabled]
                    : [styles.button, styles.confirmButton]
                }>
                <Text
                  style={
                    loading ? styles.textDisabled : styles.confirmButtonText
                  }
                  onPress={create}>
                  Confirm
                </Text>
                {loading && (
                  <ActivityIndicator
                    size={'small'}
                    color={'#C5C8D7'}
                    style={styles.activity}
                  />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

CreateFolderModal.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width,
    height: 220,

    alignItems: 'center',
  },
  canvas: {
    position: 'absolute',
    width,
    height: 220,
  },
  modal: {
    width: MODAL_WIDTH,
    marginTop: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontFamily: 'UberBold',
    fontSize: 15,
  },
  image: {
    width: 45,
    height: 45,
  },
  inputContainer: {
    height: 40,
    backgroundColor: '#F3F3F4',
    flexDirection: 'row',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    padding: 5,
    fontFamily: 'UberBold',
    color: '#C5C8D7',
    borderRadius: 3,
  },
  icon: {
    backgroundColor: '#000',
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontFamily: 'Uber',
    color: 'red',
    paddingTop: 5,
    paddingBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: MODAL_WIDTH / 2 - 15,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 40,
  },
  confirmButton: {
    backgroundColor: '#3366ff',
  },
  confirmButtonText: {
    fontFamily: 'UberBold',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#EDF1F7',
  },
  cancelButtonText: {
    fontFamily: 'UberBold',
    color: '#c3c3c3',
  },
  createDisabled: {
    backgroundColor: '#F3F3F4',
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#F3F3F4',
  },
  cancelDisabled: {
    borderWidth: 0.5,
    backgroundColor: '#F3F3F4',
    borderColor: '#F3F3F4',
  },
  textDisabled: {
    color: '#C5C8D7',
    fontFamily: 'Uber',
  },
  activity: {
    marginHorizontal: 10,
  },
});

export default withKeyboard(CreateFolderModal);
