import {Dimensions, LogBox, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import emitter from '../../../utils/emitter';

LogBox.ignoreLogs(['source.uri should not be']);

const {width: windowWidth} = Dimensions.get('window');

type PinchableImageReflectionProps = {
  dimensions: Animated.SharedValue<{width: number; height: number}>;
  translateX: Animated.SharedValue<number>;
  translateY: Animated.SharedValue<number>;
  scale: Animated.SharedValue<number>;
  borderRadius: Animated.SharedValue<number>;
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
};

const SIZE = (windowWidth * 0.9 - 10) / 2;

const PinchableImageReflection: React.FC<PinchableImageReflectionProps> = ({
  dimensions,
  translateX,
  translateY,
  scale,
  borderRadius,
  x,
  y,
}) => {
  const [uri, setUri] = useState('');

  useEffect(() => {
    const listener = emitter.addListener('sp', (url: string) => {
      setUri(url);
    });

    const empty = emitter.addListener('empty', () => {
      setUri('');
    });

    return () => {
      empty.remove();
      listener.remove();
    };
  }, []);

  const derivedDimensions = useDerivedValue(() => {
    const isWider = dimensions.value.width > dimensions.value.height;
    const aspectRatio = dimensions.value.width / dimensions.value.height;
    const resizer =
      SIZE / Math.min(dimensions.value.width, dimensions.value.height);

    const resizedHeight = interpolate(
      scale.value,
      [1, 2],
      [SIZE, (dimensions.value.width / aspectRatio) * resizer],
      Extrapolate.CLAMP,
    );

    const resizedWidth = interpolate(
      scale.value,
      [1, 2],
      [SIZE, dimensions.value.height * aspectRatio * resizer],
      Extrapolate.CLAMP,
    );

    return {
      width: isWider ? SIZE : resizedWidth,
      height: isWider ? resizedHeight : SIZE,
    };
  }, [scale, dimensions]);

  const rStyle = useAnimatedStyle(() => ({
    height: derivedDimensions.value.height,
    width: derivedDimensions.value.width,
    position: 'absolute',
    top: y.value,
    left: x.value,
    borderRadius: borderRadius.value,
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {scale: scale.value},
    ],
  }));

  return (
    <Animated.View style={[rStyle]}>
      <Animated.Image
        source={{uri}}
        style={styles.image}
        resizeMode={'cover'}
        resizeMethod={'scale'}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

export default PinchableImageReflection;
