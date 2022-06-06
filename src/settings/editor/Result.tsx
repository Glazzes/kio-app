import {View, StyleSheet, Image} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
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
      <Image source={{uri}} style={styles.image} />
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
    width: 150,
    height: 150,
    borderRadius: 75,
  },
});

export default Result;
