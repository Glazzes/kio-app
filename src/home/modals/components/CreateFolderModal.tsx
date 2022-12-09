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
import {withKeyboard} from '../../../shared/hoc';
import ModalWrapper from './ModalWrapper';
import Button from '../../../shared/components/Button';
import {createFolder} from '../utils/createFolder';

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

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [folderName, setFolderName] = useState<string>('');
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const clear = () => {
    if (!isEditable) {
      ref.current?.clear();
      setFolderName('');
      setIsDisabled(true);
    }
  };

  const onChangeText = (text: string): void => {
    setIsDisabled(text.length === 0);
    setFolderName(text);
  };

  const createFolderWrapper = async () => {
    setIsEditable(true);

    try {
      await createFolder(folderId, folderName, componentId);
    } catch (e) {
    } finally {
      setIsEditable(false);
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
            editable={!isEditable}
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
          <Button
            text="Cancel"
            width={MODAL_WIDTH / 2 - 15}
            onPress={hideModal as any}
            extraStyle={styles.cancelButton}
            extraTextStyle={styles.cancelButtonText}
          />

          <Button
            text="Confirm"
            width={MODAL_WIDTH / 2 - 15}
            onPress={createFolderWrapper}
            disabled={isDisabled}
          />
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
  cancelButton: {
    backgroundColor: '#EDF1F7',
  },
  cancelButtonText: {
    fontFamily: 'UberBold',
    color: '#c3c3c3',
  },
});

export default withKeyboard(CreateFolderModal);
