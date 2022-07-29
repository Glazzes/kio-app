import {Dimensions, Image, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {File} from '../../../utils/types';
import authStore from '../../../store/authStore';
import {useVector} from 'react-native-redash';
import Animated, {
  Extrapolate,
  interpolate,
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Star from '../folder/Star';
import {pinch} from '../../../utils/animations';
import emitter from '../../../utils/emitter';

type Reflection = {
  rtranslateX: Animated.SharedValue<number>;
  rtranslateY: Animated.SharedValue<number>;
  rscale: Animated.SharedValue<number>;
  rBorderRadius: Animated.SharedValue<number>;
  rx: Animated.SharedValue<number>;
  ry: Animated.SharedValue<number>;
};

type ImageThumbnailProps = {
  image: File;
  index: number;
  selectedIndex: Animated.SharedValue<number>;
};

const {height} = Dimensions.get('window');
const uri = 'file:///storage/sdcard0/Descargas/fox.jpg';

const SIZE = 140;
const center = {
  x: SIZE / 2,
  y: SIZE / 2,
};

const ImageThumbnail: React.FC<ImageThumbnailProps & Reflection> = ({
  image,
  selectedIndex,
  index,
  rtranslateX,
  rtranslateY,
  rscale,
  rx,
  ry,
  rBorderRadius,
}) => {
  const accessToken = authStore(state => state.accessToken);

  const aref = useAnimatedRef<Animated.View>();

  const dimensions = useVector(0, 0);
  const borderRadius = useSharedValue<number>(10);
  const translate = useVector(0, 0);
  const origin = useVector(0, 0);
  const scale = useSharedValue<number>(1);
  const canPinch = useSharedValue<boolean>(true);
  const opacity = useSharedValue<number>(1);

  const elevation = useSharedValue<number>(1);

  const setPic = () => {
    emitter.emit('sp', uri);
  };

  const setEmpty = () => emitter.emit('empty');

  const pinchG = Gesture.Pinch()
    .hitSlop({vertical: 20, horizontal: 20})
    .onStart(() => {
      runOnJS(setPic)();
      const {pageX, pageY} = measure(aref);
      rx.value = pageX;
      ry.value = pageY;

      borderRadius.value = withTiming(0);
      rBorderRadius.value = withTiming(0);
      opacity.value = withTiming(0, {duration: 150});
      selectedIndex.value = index;
    })
    .onChange(e => {
      const {translateX, translateY} = pinch(
        center,
        {x: 0, y: 0},
        e,
        {x: origin.x, y: origin.y},
        canPinch,
      );

      translate.x.value = translateX;
      rtranslateX.value = translateX;

      translate.y.value = translateY;
      rtranslateY.value = translateY;

      scale.value = e.scale;
      rscale.value = e.scale;
    })
    .onEnd(() => {
      runOnJS(setEmpty)();
      canPinch.value = true;
      origin.x.value = 0;
      origin.y.value = 0;

      scale.value = withTiming(1, {duration: 150}, hasFinished => {
        if (hasFinished) {
          opacity.value = withDelay(150, withTiming(1));
          selectedIndex.value = 0;
        }
      });
      rscale.value = withTiming(1, {duration: 150});

      borderRadius.value = withTiming(10);
      rBorderRadius.value = withTiming(10);

      translate.x.value = withTiming(0);
      rtranslateX.value = withTiming(0, undefined, hasFinished => {
        if (hasFinished) {
          rx.value = -height;
          ry.value = -height;
        }
      });

      translate.y.value = withTiming(0);
      rtranslateY.value = withTiming(0);
    });

  const reanimatedContainerStyles = useAnimatedStyle(() => {
    const isWider = dimensions.x.value > dimensions.y.value;
    const aspectRatio = dimensions.x.value / dimensions.y.value;

    const resizer = isWider
      ? SIZE / dimensions.x.value
      : SIZE / dimensions.y.value;

    return {
      height: isWider
        ? interpolate(
            scale.value,
            [1, 2],
            [SIZE, Math.round((dimensions.x.value / aspectRatio) * resizer)],
            Extrapolate.CLAMP,
          )
        : SIZE,
      width: SIZE,
      transform: [
        {translateX: translate.x.value},
        {translateY: translate.y.value},
        {scale: scale.value},
      ],
    };
  });

  const reanimatedImageStyles = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: borderRadius.value,
  }));

  const cc = useAnimatedStyle(() => ({
    opacity: elevation.value,
  }));

  useEffect(() => {
    Image.getSize(uri, (w, h) => {
      dimensions.x.value = w;
      dimensions.y.value = h;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      ref={aref}
      entering={ZoomIn.delay(index * 300)}
      exiting={ZoomOut.delay(300)}
      style={[styles.root, cc]}>
      <GestureDetector gesture={pinchG}>
        {/*
           Wrapping the view that's gonna be pinched within a dummy animated view
           for some reason allows for a better pinch gesture
           */}
        <Animated.View style={[styles.thumb]}>
          <Animated.View style={[styles.thumb, reanimatedContainerStyles]}>
            <Animated.Image
              nativeID={`img-${image.id}`}
              style={[styles.image, reanimatedImageStyles]}
              source={{uri, headers: {Authorization: accessToken}}}
              resizeMode={'cover'}
              resizeMethod={'scale'}
            />
            <Star opacity={opacity} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: 160,
    height: 140,
    marginVertical: 20,
  },
  thumb: {
    height: 140,
    width: 140,
    borderRadius: 10,
    backgroundColor: 'lightgrey',
  },
  image: {
    width: SIZE,
    height: SIZE,
  },
});

export default React.memo(ImageThumbnail);
