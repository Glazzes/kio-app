import {View, Dimensions, StyleSheet, Text} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

type NoContentProps = {};

const {width} = Dimensions.get('window');

const NoContent: React.FC<NoContentProps> = ({}) => {
  return (
    <View style={styles.root}>
      <LottieView
        source={require('./nocontent.json')}
        style={{width: width * 0.85, height: width * 0.85}}
        autoPlay={true}
        loop={true}
      />
      <Text style={styles.message}>This folder is currently empty</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.9,
    height: width * 0.9,
  },
  message: {
    fontFamily: 'UberBold',
    textAlign: 'center',
  },
});

export default NoContent;
