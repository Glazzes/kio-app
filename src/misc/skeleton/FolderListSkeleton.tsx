import {View, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import FolderSkeleton from './FolderSkeleton';

const {width} = Dimensions.get('window');

const FolderListSkeleton = () => {
  return (
    <View style={styles.root}>
      <FolderSkeleton />
      <FolderSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    flexDirection: 'row',
    paddingLeft: width * 0.05,
  },
});

export default FolderListSkeleton;
