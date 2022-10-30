import {View, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useVector} from 'react-native-redash';
import {clamp} from '../shared/functions/clamp';

type RotationProps = {};

const {width} = Dimensions.get('window');

const image =
  'https://es.bellfor.info/image/catalog/Blog/blog_pictures_multilang/husky-merkmale.jpg';

const aspectRatio = 872 / 1280;
const baseWidth = 200;
const baseHeight = baseWidth / aspectRatio;

const angle = Math.PI / 18;
const scale = 1.3;

const rotatedWith = baseWidth * Math.cos(angle) + baseHeight * Math.sin(angle);
const rotatedHeight =
  baseWidth * Math.sin(angle) + baseHeight * Math.cos(angle);
const imageHeight = rotatedWith / aspectRatio;

const vh = (imageHeight * scale - rotatedHeight) / 2;
const vy = vh * Math.cos(angle);
const vx = vh * Math.sin(angle);

const hh = (rotatedWith * scale - rotatedWith) / 2;
const hy = hh * Math.sin(angle);
const hx = hh * Math.cos(angle);

const Rotation: React.FC<RotationProps> = ({}) => {
  const translate = useVector(0, 0);
  const offset = useVector(0, 0);

  const pan = Gesture.Pan()
    .onStart(e => {
      offset.x.value = translate.x.value;
      offset.y.value = translate.y.value;
    })
    .onChange(e => {
      translate.x.value = e.translationX + offset.x.value;
      translate.y.value = e.translationY + offset.y.value;
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: clamp(translate.x.value, -hh, hh)},
        {translateY: clamp(translate.y.value, -vh, vh)},
        {rotate: `${angle}rad`},
        {scale},
      ],
    };
  });

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <GestureDetector gesture={pan}>
          <Animated.Image
            style={[styles.image, rStyle]}
            source={{uri: image}}
          />
        </GestureDetector>
        <View style={styles.border} pointerEvents={'none'} />
        <View style={styles.surround} pointerEvents={'none'} />
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
    width: rotatedWith,
    height: imageHeight,
    // transform: [{rotate: `${angle}rad`}, {scale: scale}],
  },
  surround: {
    position: 'absolute',
    width: rotatedWith,
    height: rotatedHeight,
    borderWidth: 1,
    borderColor: 'lime',
    transform: [{rotate: `${angle}rad`}, {translateX: 0}],
  },
  border: {
    width: baseWidth,
    height: baseHeight,
    borderWidth: 1,
    borderColor: 'orange',
    position: 'absolute',
    // transform: [{translateY: 20}, {translateX: -hx}],
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
