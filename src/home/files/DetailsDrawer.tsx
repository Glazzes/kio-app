import {Dimensions, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import useDetailsStore from '../../store/detailsStore';

type DetailsDrawerProps = {};

const {width, height} = Dimensions.get('window');

const DetailsDrawer: NavigationFunctionComponent<DetailsDrawerProps> = ({}) => {
  const file = useDetailsStore(s => s.object);

  return <ScrollView style={styles.root}></ScrollView>;
};

const styles = StyleSheet.create({
  root: {
    height,
    width: width * 0.75,
    backgroundColor: '#fff',
  },
});

DetailsDrawer.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

export default DetailsDrawer;
