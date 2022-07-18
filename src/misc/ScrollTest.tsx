import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import AvatarGroup from './AvatarGroup';

type ScrollTestProps = {};

const {width, height} = Dimensions.get('window');

const ScrollTest: NavigationFunctionComponent<ScrollTestProps> = ({}) => {
  return (
    <ScrollView contentContainerStyle={styles.root} stickyHeaderIndices={[0]}>
      <View style={styles.box} />
      <AvatarGroup photos={[]} />
      <ScrollView contentContainerStyle={styles.content} />
    </ScrollView>
  );
};

ScrollTest.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    height: height * 1.5,
    paddingTop: 200,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    height: height / 2,
    width,
    backgroundColor: 'orange',
  },
  content: {
    width,
    height: height * 2,
    backgroundColor: 'lime',
  },
});

export default ScrollTest;
