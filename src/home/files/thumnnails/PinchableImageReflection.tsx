import {Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import emitter from '../../../utils/emitter';

type PinchableImageReflectionProps = {
  translateX: Animated.SharedValue<number>;
  translateY: Animated.SharedValue<number>;
  scale: Animated.SharedValue<number>;
  borderRadius: Animated.SharedValue<number>;
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
};

const PinchableImageReflection: React.FC<PinchableImageReflectionProps> = ({
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

  const rStyle = useAnimatedStyle(() => ({
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
    <Animated.View style={[styles.image, rStyle]}>
      {uri !== '' && (
        <Image
          source={{uri}}
          style={styles.image}
          resizeMode={'cover'}
          resizeMethod={'scale'}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 140,
    width: 140,
  },
});

export default PinchableImageReflection;
