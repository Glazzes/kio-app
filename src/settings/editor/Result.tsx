import {View, StyleSheet} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import FastImage from 'react-native-fast-image';

type ResultProps = {
  uri: string;
};

const Result: NavigationFunctionComponent<ResultProps> = ({uri}) => {
  return (
    <View style={styles.root}>
      <FastImage source={{uri}} style={styles.image} resizeMode={'cover'} />
    </View>
  );
};

Result.options = {
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
  image: {
    width: 200,
    height: 200,
  },
});

export default Result;
