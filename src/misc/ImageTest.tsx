import {StyleSheet} from 'react-native';
import React from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type ImageTestProps = {};

Animated.addWhitelistedUIProps({aspectRatio: true});

const ImageTest: React.FC<ImageTestProps> = ({}) => {
  const scale = useSharedValue<number>(1);

  const rStyle = useAnimatedStyle(() => {
    const width = 120;

    const yFactor = width / 1334;

    return {
      width,
      maxWidth: undefined,
      height: interpolate(
        scale.value - 1,
        [0, 2],
        [width, yFactor * 1817],
        Extrapolate.CLAMP,
      ),
      maxHeight: undefined,
      transform: [{scale: scale.value}],
    };
  });

  const pinch = Gesture.Pinch().onUpdate(e => {
    scale.value = Math.max(1, e.scale);
  });

  return (
    <GestureDetector gesture={pinch}>
      <Animated.Image source={require('./glaceon.jpg')} style={[rStyle]} />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    maxWidth: undefined,
    height: undefined,
    maxHeight: undefined,
    aspectRatio: 1817 / 1334,
  },
});

export default ImageTest;
