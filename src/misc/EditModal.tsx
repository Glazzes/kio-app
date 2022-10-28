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
import {Point} from '../shared/types';
import ModalWrapper from '../shared/components/ModalWrapper';

type EditModalProps = {};

type Visibility = {
  name: string;
  message: string;
};

const {width} = Dimensions.get('window');

const HEIGHT = 40;
const WIDTH = width * 0.75;

const visibilites: Visibility[] = [
  {
    name: 'Owner',
    message: 'Only you can see this folder and its inner contents',
  },
  {
    name: 'Restricted',
    message: 'Oly you and co-owners can see this folder and its inner contents',
  },
  {
    name: 'Public',
    message: 'Everyone can see this folder and its inner contents',
  },
];

const EditModal: NavigationFunctionComponent<EditModalProps> = ({
  componentId,
}) => {
  const ref = useRef<View>();

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [position, setposition] = useState<Point>({x: 0, y: 0});

  const [visibility, setVisibility] = useState<
    'Owner' | 'Restricted' | 'Public'
  >('Owner');

  const toggleDropdown = () => {
    ref.current?.measure((x, y, w, h, pageX, pageY) => {
      setposition({x: pageX, y: pageY});
      setShowDropdown(d => !d);
    });
  };

  const dissmis = () => {
    Navigation.dismissModal(componentId);
  };

  return (
    <View style={styles.root}>
      <ModalWrapper>
        <Text style={styles.title}>Modify glaceon.png</Text>
        <View style={styles.inputContainer}>
          <TextInput placeholder="Change name" />
        </View>
        <View>
          <Text style={styles.subtitle}>Visibility</Text>
          <Text style={styles.details}>
            Only you and co-owners can see this folder and its inner contents
          </Text>
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
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={dissmis}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.confirmButton]}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </Pressable>
        </View>
      </ModalWrapper>
      {showDropdown && (
        <View style={[styles.dropwdown, {top: position.y, left: position.x}]}>
          {visibilites.map((v, index) => {
            return (
              <Pressable
                onPress={() => {
                  setShowDropdown(false);
                  setVisibility(v.name);
                }}
                style={styles.dropdownSection}
                key={`${v.name}-${index}`}>
                <Text style={styles.visibility}>{v.name}</Text>
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
    fontFamily: 'UberBold',
    color: '#C5C8D7',
    borderRadius: 3,
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

export default EditModal;
