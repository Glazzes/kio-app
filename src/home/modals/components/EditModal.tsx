import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {File, FileVisibility, Folder, Point} from '../../../shared/types';
import ModalWrapper from './ModalWrapper';
import Button from '../../../shared/components/Button';
import {peekLastNavigationScreen} from '../../../store/navigationStore';
import {withKeyboard} from '../../../shared/hoc';
import {editResource} from '../utils/editResource';

type EditModalProps = {
  file: File | Folder;
};

const {width} = Dimensions.get('window');

const HEIGHT = 40;
const WIDTH = width * 0.75;

const visibilityInfo = {
  [FileVisibility.OWNER]:
    'Only you can see this file/folder and its inner contents',
  [FileVisibility.RESTRICTED]:
    'Only you and co-owners can see this file/folder and its inner contents',
  [FileVisibility.PUBLIC]:
    'Everyone can see this file/folder and its inner contents',
};

const EditModal: NavigationFunctionComponent<EditModalProps> = ({
  componentId,
  file,
}) => {
  const isFile = (file as File).contentType !== undefined;
  const extension = file.name.substring(
    file.name.lastIndexOf('.'),
    file.name.length,
  );

  const ref = useRef<View>();

  const [name, setName] = useState<string>(
    isFile ? file.name.replace(extension, '') : file.name,
  );
  const [isNameValid, setIsNameValid] = useState<boolean>(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [position, setposition] = useState<Point>({x: 0, y: 0});
  const [visibility, setVisibility] = useState<FileVisibility>(file.visibility);

  const toggleDropdown = () => {
    ref.current?.measure((x, y, w, h, pageX, pageY) => {
      setposition({x: pageX, y: pageY});
      setShowDropdown(d => !d);
    });
  };

  const onChangeText = (text: string) => {
    setIsNameValid(text.length > 0);
    setName(text);
  };

  const dissmis = () => {
    Navigation.dismissModal(componentId);
  };

  const editFile = async () => {
    const lastFolder = peekLastNavigationScreen().folder;
    const newName = name.includes(extension) ? name : name + extension;
    editResource({
      file: file,
      from: lastFolder.id,
      newName: isFile ? newName : name,
      visibility,
    });
  };

  return (
    <View style={styles.root}>
      <ModalWrapper>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
          Modify {file.name}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="New name"
            onChangeText={onChangeText}
            style={styles.input}
            value={name}
          />
          {isFile ? (
            <View style={styles.extensionContainer}>
              <Text style={styles.exntesion}>{extension}</Text>
            </View>
          ) : null}
        </View>
        <View>
          <Text style={styles.subtitle}>Visibility</Text>
          <Text style={styles.details}>{visibilityInfo[visibility]}</Text>
          <View style={styles.dropdownContainer}>
            <Pressable
              ref={ref as any}
              style={styles.dropdownSection}
              onPress={toggleDropdown}>
              <Text style={styles.visibility}>{visibility}</Text>
              <Icon name={'ios-chevron-down'} size={22} color={'#000'} />
            </Pressable>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            text="Cancel"
            width={WIDTH / 2 - 15}
            onPress={dissmis as any}
            extraStyle={styles.cancelButton}
            extraTextStyle={styles.cancelButtonText}
          />

          <Button
            text="Confirm"
            width={WIDTH / 2 - 15}
            onPress={editFile}
            disabled={!isNameValid}
          />
        </View>
      </ModalWrapper>
      {showDropdown && (
        <View style={[styles.dropwdown, {top: position.y, left: position.x}]}>
          {Object.keys(visibilityInfo).map((v, index) => {
            return (
              <Pressable
                onPress={() => {
                  setShowDropdown(false);
                  // @ts-ignore
                  setVisibility(v);
                }}
                style={styles.dropdownSection}
                key={`${v}-${index}`}>
                <Text style={styles.visibility}>{v.toLocaleLowerCase()}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

EditModal.options = {
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
  menu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: width * 0.75,
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
  },
  inputContainer: {
    height: HEIGHT,
    backgroundColor: '#F3F3F4',
    flexDirection: 'row',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    padding: 5,
    fontFamily: 'Uber',
    color: '#C5C8D7',
    borderRadius: 3,
  },
  extensionContainer: {
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exntesion: {
    fontFamily: 'Uber',
    color: '#C5C8D7',
  },
  subtitle: {
    fontFamily: 'UberBold',
    color: '#000',
  },
  details: {
    fontFamily: 'Uber',
    fontSize: 12,
  },
  dropdownContainer: {
    height: HEIGHT,
    width: WIDTH - 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#c7c9c8',
    borderRadius: 5,
  },
  dropwdown: {
    position: 'absolute',
    top: 0,
    height: HEIGHT * 3,
    width: WIDTH - 20,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  dropdownSection: {
    height: HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  visibility: {
    fontFamily: 'UberBold',
    color: '#000',
    textTransform: 'capitalize',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: WIDTH / 2 - 15,
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
});

export default withKeyboard(EditModal);
