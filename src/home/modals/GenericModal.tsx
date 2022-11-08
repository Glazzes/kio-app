import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import React, {useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import Icon from 'react-native-vector-icons/Ionicons';
import ModalWrapper from '../../shared/components/ModalWrapper';

type GenericModalProps = {
  title: string;
  message: string;
  action: () => void;
};

const {width} = Dimensions.get('window');
const MODAL_WIDTH = width * 0.75;
const SPACING = 10;

const GenericModal: NavigationFunctionComponent<GenericModalProps> = ({
  componentId,
  title,
  message,
  action,
}) => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);

  const toggleSelected = async () => {
    await impactAsync(ImpactFeedbackStyle.Light);
    setSelected(s => !s);
  };

  const close = () => {
    Navigation.dismissModal(componentId);
  };

  const performAction = async () => {
    setDisabled(true);
    try {
      await action();
      close();
    } catch (e) {
    } finally {
      setDisabled(false);
    }
  };

  return (
    <View style={styles.root}>
      <ModalWrapper>
        <Text style={styles.title}>{title}</Text>
        <Text>{message}</Text>

        <Pressable
          style={styles.checkBoxContainer}
          onPress={toggleSelected}
          hitSlop={40}>
          <View
            style={[
              styles.checkBox,
              selected ? styles.selectedCheckBox : styles.unselectedCheckBox,
            ]}>
            <Icon name={'md-checkmark-outline'} size={18} color={'#fff'} />
          </View>
          <Text style={styles.optionText}>Do not show again</Text>
        </Pressable>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={close}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              disabled ? styles.cancelButton : styles.confirmButton,
            ]}
            onPress={performAction}>
            <Text
              style={
                disabled ? styles.cancelButtonText : styles.confirmButtonText
              }>
              Confirm
            </Text>
          </Pressable>
        </View>
      </ModalWrapper>
    </View>
  );
};

GenericModal.options = {
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
  modal: {
    width: MODAL_WIDTH,
    backgroundColor: '#fff',
    borderRadius: SPACING,
    padding: SPACING,
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    width: MODAL_WIDTH / 2 - 15,
    height: 40,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#EDF1F7',
  },
  cancelButtonText: {
    fontFamily: 'UberBold',
    color: '#c3c3c3',
  },
  confirmButton: {
    backgroundColor: '#3366ff',
  },
  confirmButtonText: {
    fontFamily: 'UberBold',
    color: '#fff',
  },
  checkBoxContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    height: 20,
    width: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckBox: {
    backgroundColor: '#3366ff',
  },
  unselectedCheckBox: {
    backgroundColor: '#fff',
    borderColor: '#c3c3c3',
    borderWidth: 1,
  },
  optionText: {
    marginLeft: 10,
    color: '#3F4E4F',
    fontFamily: 'Uber',
  },
});

export default GenericModal;
