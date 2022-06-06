import {View, StyleSheet, Text} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {Gesture} from 'react-native-gesture-handler';
import FilesList from './files/FilesList';
import {useSharedValue} from 'react-native-reanimated';
import {Camera, CameraType} from 'expo-camera';

const Home: NavigationFunctionComponent = ({}) => {
  return (
    <View style={styles.root}>
      <FilesList />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Home.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

export default Home;
