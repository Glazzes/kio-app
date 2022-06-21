import {View, Text, Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';

type CreateFolderModalProps = {};

const {width, height} = Dimensions.get('window');

const CreateFolderModal: NavigationFunctionComponent<
  CreateFolderModalProps
> = ({}) => {
  return (
    <View style={styles.modal}>
      <Text>Welcome to CreateFolderModal</Text>
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
  modal: {
    width: width / 2,
    height: height / 2,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateFolderModal;
