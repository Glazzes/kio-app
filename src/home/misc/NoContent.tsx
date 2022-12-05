import {View, Dimensions, StyleSheet, Text} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

type NoContentProps = {
  fetchComplete: boolean;
  files: number;
  folders: number;
};

const {width} = Dimensions.get('window');

const NoContent: React.FC<NoContentProps> = ({
  files,
  folders,
  fetchComplete,
}) => {
  if (!fetchComplete) {
    return (
      <View style={styles.root}>
        <LottieView
          source={require('./assets/loading.json')}
          style={{width: width * 0.85, height: width * 0.85}}
          autoPlay={true}
          loop={true}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LottieView
        source={require('./assets/nocontent.json')}
        style={{width: width * 0.85, height: width * 0.85}}
        autoPlay={true}
        loop={true}
      />
      {folders === 0 && files === 0 && (
        <Text style={styles.message}>This folder is currently empty</Text>
      )}
      {files === 0 && folders !== 0 && (
        <Text style={styles.message}>This folder has no files yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: width,
  },
  message: {
    fontFamily: 'UberBold',
    textAlign: 'center',
  },
});

export default NoContent;
