import {View, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import FastImage from 'react-native-fast-image';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';

type ResultProps = {
  uri: string;
};

const Result: NavigationFunctionComponent<ResultProps> = ({uri}) => {
  useEffect(() => {
    impactAsync(ImpactFeedbackStyle.Medium);
  }, []);

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
