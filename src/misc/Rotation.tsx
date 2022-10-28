import {View, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {clamp} from '../shared/functions/clamp';
import {useCanvasRef} from '@shopify/react-native-skia';
import {useVector} from 'react-native-redash';

type RotationProps = {};

const {width} = Dimensions.get('window');

const image =
  'https://es.bellfor.info/image/catalog/Blog/blog_pictures_multilang/husky-merkmale.jpg';

const aspectRatio = 872 / 1280;
const baseWidth = 200;
const baseHeight = baseWidth / aspectRatio;

const distance = width / 2 - 20;

const keepWithinBounds = (
  angle: number,
  scale: number,
  widths: number,
  height: number,
  translateY: number,
): {x: number; y: number} => {
  'worklet';
  angle = Math.abs(angle);
  const imageWidth = widths * Math.cos(angle) + height * Math.sin(angle);
  const imageHeght = imageWidth / aspectRatio;

  const selectionHeight = widths * Math.sin(angle) + height * Math.cos(angle);

  const hh = (imageWidth * scale - imageWidth) / 2;
  const hWidth = hh * Math.cos(angle);
  const hHeight = hh * Math.sin(angle);

  const h = (imageHeght * scale - selectionHeight) / 2;
  const x = h * Math.sin(angle) + hWidth;
  const y = h * Math.cos(angle) + hHeight;

  const offY = clamp(translateY, -1 * y, y);
  const offX = interpolate(offY, [-1 * y, y], [x, -1 * x], Extrapolate.CLAMP);

  return {x: offX, y: offY};
};

const Rotation: React.FC<RotationProps> = ({}) => {
  const translateX = useSharedValue<number>(0);
  const offsetX = useSharedValue<number>(0);

  const scale = useSharedValue<number>(1);
  const scaleOffset = useSharedValue<number>(1);
  const translate = useVector(0, 0);
  const offset = useVector(0, 0);

  const a = useDerivedValue<number>(() => {
    return interpolate(
      translateX.value,
      [-distance, 0, distance],
      [-Math.PI / 4, 0, Math.PI / 4],
      Extrapolate.CLAMP,
    );
  }, [translateX]);

  const pinch = Gesture.Pinch()
    .onStart(_ => {
      scaleOffset.value = scale.value;
    })
    .onChange(e => {
      scale.value = scaleOffset.value * e.scale;
    });

  const imagePan = Gesture.Pan()
    .onStart(() => {
      offset.x.value = translate.x.value;
      offset.y.value = translate.y.value;
    })
    .onChange(e => {
      translate.x.value = offset.x.value + e.translationX;
      translate.y.value = offset.y.value + e.translationY;
    })
    .onEnd(() => {
      const {x, y} = keepWithinBounds(
        a.value,
        scale.value,
        baseWidth,
        baseHeight,
        translate.y.value,
      );

      translate.x.value = withTiming(x, {duration: 150});
      translate.y.value = withTiming(y, {duration: 150});
    });

  const pan = Gesture.Pan()
    .onStart(_ => {
      offsetX.value = translateX.value;
    })
    .onChange(e => {
      translateX.value = e.translationX + offsetX.value;
    });

  const imageStyles = useAnimatedStyle(() => {
    const w =
      baseWidth * Math.cos(Math.abs(a.value)) +
      baseHeight * Math.sin(Math.abs(a.value));

    return {
      width: w,
      height: w / aspectRatio,
      transform: [
        {translateX: translate.x.value},
        {translateY: translate.y.value},
        {scale: scale.value},
        {rotate: `${a.value}rad`},
      ],
    };
  });

  const sliderStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: clamp(translateX.value, -distance, distance)}],
    };
  });

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <GestureDetector gesture={Gesture.Race(pinch, imagePan)}>
          <Animated.Image
            source={{uri: image}}
            resizeMethod={'scale'}
            resizeMode={'cover'}
            style={[styles.image, imageStyles]}
          />
        </GestureDetector>

        <View style={styles.border} pointerEvents={'none'} />
      </View>
      <View style={styles.slider}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.ball, sliderStyles]} />
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: baseWidth + 4,
    height: baseHeight + 4,
    borderColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    // width: rotatedSelectionWidth,
    // height: rotatedImageHeight,
    // transform: [{rotate: `${angle}rad`}],
  },
  surround: {
    position: 'absolute',
    // width: rotatedSelectionWidth,
    // height: rotatedSelectionHeight,
    // transform: [{rotate: `${angle}rad`}],
    borderWidth: 1,
    borderColor: 'lime',
  },
  border: {
    width: baseWidth,
    height: baseHeight,
    borderWidth: 1,
    borderColor: 'orange',
    position: 'absolute',
  },
  slider: {
    width,
    height: 50,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 15,
  },
  ball: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#3366ff',
  },
});

export default Rotation;
