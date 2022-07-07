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
import React, {useRef, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {withKeyboard} from '../../utils/hoc';
import {ShadowView} from '@dimaportenko/react-native-shadow-view';

type CreateFolderModalProps = {
  parentComponentId?: string;
  parentFolderId?: string;
  folderNames?: string[];
};

const {width} = Dimensions.get('window');
const MODAL_WIDTH = width * 0.8;

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

  const create = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const hideModal = () => {
    Keyboard.dismiss();
    Navigation.dismissModal(componentId);
  };

  return (
    <Pressable style={styles.root} onPress={hideModal}>
      <Pressable>
        <View style={styles.modal}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Create Folder</Text>
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
              placeholder={'New folder name'}
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
                  : [styles.button, styles.cancel]
              }
              onPress={hideModal}>
              <Text
                style={loading ? styles.textDisabled : {fontFamily: 'Uber'}}>
                CANCEL
              </Text>
            </Pressable>
            <Pressable
              style={
                loading
                  ? [styles.button, styles.createDisabled]
                  : [styles.button, styles.create]
              }>
              <Text
                style={loading ? styles.textDisabled : styles.buttonText}
                onPress={create}>
                CREATE
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
      </Pressable>
    </Pressable>
  );
};

CreateFolderModal.options = {
  sideMenu: {
    right: {
      visible: false,
    },
  },
  hardwareBackButton: {
    dismissModalOnPress: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: MODAL_WIDTH,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 2, height: 4},
    shadowRadius: 10,
    elevation: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontFamily: 'UberBold',
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
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 5,
    fontFamily: 'Uber',
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
    width: MODAL_WIDTH / 2 - 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  create: {
    backgroundColor: '#3366ff',
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#3366ff',
  },
  createDisabled: {
    backgroundColor: '#F3F3F4',
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#F3F3F4',
  },
  cancel: {
    borderWidth: 0.5,
  },
  cancelDisabled: {
    borderWidth: 0.5,
    backgroundColor: '#F3F3F4',
    borderColor: '#F3F3F4',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Uber',
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
