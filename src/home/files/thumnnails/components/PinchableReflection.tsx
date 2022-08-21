import {Dimensions, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import emitter from '../../../../utils/emitter';
import {Dimension} from '../../../../shared/types';

type PinchableReflectionProps = {
  dimensions: Animated.SharedValue<Dimension>;
  translateX: Animated.SharedValue<number>;
  translateY: Animated.SharedValue<number>;
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  scale: Animated.SharedValue<number>;
};

const {width: windowWidth} = Dimensions.get('window');

const SIZE = (windowWidth * 0.9 - 10) / 2;

/*
You are in presence of the most strange bug I have ever faced, using booleans
within this component will provoke the animated style to not animate width and height
properties correctly, therefore the boolean toggle must happen outside this component
*/
const PinchableReflection: React.FC<PinchableReflectionProps> = ({
  translateX,
  translateY,
  x,
  y,
  scale,
  dimensions,
}) => {
  const [uri, setUri] = useState<string>();

  const imageDimensions = useDerivedValue(() => {
    const isWider = dimensions.value.width > dimensions.value.height;
    const aspectRatio = dimensions.value.width / dimensions.value.height;
    const resizer =
      SIZE / Math.min(dimensions.value.width, dimensions.value.height);

    return {
      width: isWider
        ? interpolate(
            scale.value,
            [1, 1.75],
            [SIZE, dimensions.value.height * aspectRatio * resizer],
            Extrapolate.CLAMP,
          )
        : SIZE,
      height: isWider
        ? SIZE
        : interpolate(
            scale.value,
            [1, 1.75],
            [SIZE, (dimensions.value.width / aspectRatio) * resizer],
            Extrapolate.CLAMP,
          ),
    };
  }, [scale, dimensions]);

  const rStyle = useAnimatedStyle(() => {
    return {
      width: imageDimensions.value.width,
      height: imageDimensions.value.height,
      position: 'absolute',
      top: y.value,
      left: x.value,

      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
      ],
    };
  });

  useEffect(() => {
    const updatePicture = emitter.addListener('sp', (pic: string) => {
      if (pic !== uri) {
        setUri(pic);
      }
    });

    const clearPicture = emitter.addListener('empty', () => setUri(''));

    return () => {
      updatePicture.remove();
      clearPicture.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.container, rStyle]}>
      <Image
        style={styles.image}
        source={{uri}}
        resizeMethod={'scale'}
        resizeMode={'cover'}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
});

export default PinchableReflection;
