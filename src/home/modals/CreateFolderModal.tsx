import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

type CreateFolderModalProps = {
  parentComponentId: string;
  parentFolderId?: string;
  folderNames?: string[];
};

const {width} = Dimensions.get('window');
const MODAL_WIDTH = width * 0.8;

const CreateFolderModal: NavigationFunctionComponent<
  CreateFolderModalProps
> = ({}) => {
  const folderName = useRef<string>('');
  const [selected, setSelected] = useState<boolean>(false);
  const [folderExists, setFolderExists] = useState<boolean>(true);

  const toggle = () => setSelected(s => !s);

  const onChangeText = (text: string): void => {
    folderName.current = text;
  };

  const hideModal = () => {
    Navigation.dismissAllModals();
  };

  return (
    <Pressable style={styles.root} onPress={hideModal}>
      <View style={styles.modal}>
        <View style={[styles.content]}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>New Folder</Text>
            <Image
              source={require('./assets/folder.png')}
              resizeMode={'contain'}
              style={styles.image}
            />
          </View>
          <TextInput
            style={[styles.input, {borderColor: selected ? '#336fff' : '#000'}]}
            placeholder={'Enter a folder name'}
            keyboardType={'default'}
            onFocus={toggle}
            onChangeText={onChangeText}
          />
          {folderExists && (
            <Animated.Text
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={styles.error}>
              * A folder with this name already exists
            </Animated.Text>
          )}
          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, styles.cancelButton]}>
              <Text style={{color: '#354259'}}>CANCEL</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.createButton]}>
              <Text style={styles.buttonText}>CREATE</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: MODAL_WIDTH,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  content: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 7,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
  },
  image: {
    width: 45,
    height: 45,
  },
  input: {
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: 10,
  },
  error: {
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
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  createButton: {
    backgroundColor: '#3366ff',
  },
  cancelButton: {
    borderColor: '#354259',
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CreateFolderModal;
