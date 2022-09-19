import {View, Text, Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';

type ModalContainerProps = {};

const {width, height} = Dimensions.get('window');
const MODAL_WIDTH = width * 0.75;

const ModalContainer: NavigationFunctionComponent<
  ModalContainerProps
> = ({}) => {
  return (
    <View>
      <Text>Welcome to ModalContainer</Text>
    </View>
  );
};

ModalContainer.options = {
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
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ModalContainer;
