import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  Keyboard,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  Navigation,
  NavigationFunctionComponent,
  OptionsModalPresentationStyle,
} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {withKeyboard} from '../../../utils/hoc';
import {NotificationType} from '../../../enums/notification';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {displayToast} from '../../../shared/navigation/displayToast';
import ModalWrapper from './ModalWrapper';
import {newFolderUrl} from '../../../shared/requests/contants';
import {
  emitFolderAddFolders,
  emitFolderUpdatePreview,
} from '../../../shared/emitter';
import {Folder} from '../../../shared/types';

type CreateFolderModalProps = {
  parentComponentId?: string;
  folderId: string;
};

const {width} = Dimensions.get('window');
const MODAL_WIDTH = width * 0.75;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CreateFolderModal: NavigationFunctionComponent<
  CreateFolderModalProps
> = ({componentId, folderId}) => {
  const ref = useRef<TextInput>(null);

  const [folderName, setFolderName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const clear = () => {
    if (!loading) {
      ref.current?.clear();
      setFolderName('');
    }
  };

  const onChangeText = (text: string): void => {
    setFolderName(text);
  };

  const create = async () => {
    setLoading(true);

    try {
      const uri = newFolderUrl(folderId);

      const {data} = await axiosInstance.post<Folder>(uri, undefined, {
        params: {
          name: folderName,
        },
      });

      emitFolderAddFolders(folderId, [data]);
      emitFolderUpdatePreview(folderId, 0, 1);

      Navigation.dismissModal(componentId);
      displayToast(
        'Folder created',
        `Folder "${folderName}" was created successfully`,
        NotificationType.SUCCESS,
      );
    } catch (e) {
      displayToast(
        'Creation error',
        'This folder could not be created, try again later',
        NotificationType.ERROR,
      );
    }
  };

  const hideModal = () => {
    Keyboard.dismiss();
    Navigation.dismissModal(componentId);
  };

  return (
    <View style={styles.root}>
      <ModalWrapper>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>New Folder</Text>
          <Image
            source={require('../assets/folder.png')}
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
            autoFocus={true}
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
              style={loading ? styles.textDisabled : styles.confirmButtonText}
              onPress={create}>
              Confirm
            </Text>
          </Pressable>
        </View>
      </ModalWrapper>
    </View>
  );
};

CreateFolderModal.options = {
  statusBar: {
    visible: false,
  },
  layout: {
    backgroundColor: 'transparent',
  },
  modalPresentationStyle: OptionsModalPresentationStyle.overCurrentContext,
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
