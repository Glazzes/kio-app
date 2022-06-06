import {Text, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';

type PhotoPickerProps = {
  translateY: Animated.SharedValue<number>;
};

const {width, height} = Dimensions.get('window');

const PhotoPicker: React.FC<PhotoPickerProps> = ({translateY}) => {
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  return (
    <Animated.View style={[styles.root, rStyle]}>
      <Text>Welcome to PhotoPicker</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    height,
    position: 'absolute',
    top: height,
    backgroundColor: 'salmon',
  },
});

export default PhotoPicker;
