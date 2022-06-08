import {Text, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {snapPoint} from 'react-native-redash';

type PhotoPickerProps = {
  opacity: Animated.SharedValue<number>;
  scrollY: Animated.SharedValue<number>;
};

const {width, height} = Dimensions.get('window');

const PhotoPicker: React.FC<PhotoPickerProps> = ({scrollY, opacity}) => {
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: scrollY.value}],
    };
  });

  const offset = useSharedValue<number>(0);
  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.value = scrollY.value;
    })
    .onChange(e => {
      scrollY.value = offset.value + e.translationY;
    })
    .onEnd(e => {
      const snap = snapPoint(scrollY.value, e.velocityY, [0, -height]);
      if (snap === 0) {
        scrollY.value = withTiming(snap);
        opacity.value = withTiming(1);
      }
    });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.root, rStyle]}>
        <Text>Welcome to PhotoPicker</Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    height,
    position: 'absolute',
    top: height,
    backgroundColor: 'salmon',
    elevation: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default PhotoPicker;
