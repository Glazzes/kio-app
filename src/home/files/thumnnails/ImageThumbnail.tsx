import {Dimensions, Image, StyleSheet, ViewStyle} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {File} from '../../../utils/types';
import authStore from '../../../store/authStore';
import {useVector} from 'react-native-redash';
import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Star from '../folder/Star';
import {clamp, pinch} from '../../../utils/animations';
import emitter from '../../../utils/emitter';
import {Dimension} from '../../../shared/types';

type Reflection = {
  isWider: Animated.SharedValue<boolean>;
  dimensions: Animated.SharedValue<Dimension>;
  translateX: Animated.SharedValue<number>;
  translateY: Animated.SharedValue<number>;
  scale: Animated.SharedValue<number>;
  rBorderRadius: Animated.SharedValue<number>;
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
};

type ImageThumbnailProps = {
  image: File;
  pic: string;
  index: number;
};

const {width, height} = Dimensions.get('window');

const SIZE = (width * 0.9 - 10) / 2;
const center = {
  x: SIZE / 2,
  y: SIZE / 2,
};

const ImageThumbnail: React.FC<ImageThumbnailProps & Reflection> = ({
  index,
  image,
  pic,
  translateX,
  translateY,
  scale,
  x,
  y,
  rBorderRadius,
  dimensions,
  isWider,
}) => {
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: SIZE,
    height: SIZE,
  });

  const accessToken = authStore(state => state.accessToken);

  const aref = useAnimatedRef<Animated.View>();
  const borderRadius = useSharedValue<number>(5);
  const origin = useVector(0, 0);
  const canPinch = useSharedValue<boolean>(true);
  const opacity = useSharedValue<number>(1);
  const os = useSharedValue<0 | 1>(1);

  const margin: ViewStyle = useMemo(
    () => ({
      margin: index % 2 === 0 ? width * 0.05 : 10,
    }),
    [index],
  );

  const setPic = () => {
    emitter.emit('sp', pic);
  };

  const setEmpty = () => {
    emitter.emit('empty');
  };

  const pinchG = Gesture.Pinch()
    .hitSlop({vertical: 20, horizontal: 20})
    .onStart(() => {
      runOnJS(setPic)();
      const {pageX, pageY} = measure(aref);
      x.value = pageX;
      y.value = pageY;

      isWider.value = imageDimensions.width > imageDimensions.height;
      dimensions.value = imageDimensions;

      borderRadius.value = withTiming(0);
      rBorderRadius.value = withTiming(0);

      opacity.value = withTiming(0, {duration: 150}, hasFinished => {
        if (hasFinished) {
          os.value = 0;
        }
      });
    })
    .onChange(e => {
      const {translateX: tx, translateY: ty} = pinch(
        center,
        {x: 0, y: 0},
        e,
        {x: origin.x, y: origin.y},
        canPinch,
      );

      translateX.value = tx;
      translateY.value = ty;
      scale.value = clamp(e.scale, 1, 4);
    })
    .onEnd(() => {
      canPinch.value = true;
      origin.x.value = 0;
      origin.y.value = 0;

      scale.value = withTiming(1, undefined, hasFinished => {
        if (hasFinished) {
          opacity.value = withDelay(150, withTiming(1));
        }
      });

      rBorderRadius.value = withTiming(5);
      borderRadius.value = withTiming(5);

      translateX.value = withTiming(0, undefined, hasFinished => {
        if (hasFinished) {
          runOnJS(setEmpty)();
          os.value = 1;
          x.value = -height;
          y.value = -height;
        }
      });

      translateY.value = withTiming(0);
    });

  const cc = useAnimatedStyle(() => ({
    opacity: os.value,
  }));

  const thumbContainer = useAnimatedStyle(() => ({
    overflow: 'hidden',
    borderRadius: borderRadius.value,
  }));

  useEffect(() => {
    Image.getSize(pic, (w: number, h: number) => {
      setImageDimensions({width: w, height: h});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View ref={aref} style={[styles.root, margin]}>
      <GestureDetector gesture={pinchG}>
        {/*
           Wrapping the view that's gonna be pinched within a dummy animated view
           for some reason allows for a better pinch gesture
           */}
        <Animated.View style={[styles.thumb, thumbContainer]}>
          <Animated.View style={[styles.thumb, styles.thumbContainer]}>
            <Animated.Image
              nativeID={`img-${image.id}`}
              style={[styles.image, cc]}
              source={{uri: pic, headers: {Authorization: accessToken}}}
              resizeMode={'cover'}
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
    width: SIZE,
    height: SIZE,
    marginVertical: 10,
  },
  thumbContainer: {
    borderRadius: 10,
    backgroundColor: '#F3F3F4',
  },
  thumb: {
    height: SIZE,
    width: SIZE,
    borderRadius: 10,
  },
  image: {
    flex: 1,
  },
});

export default React.memo(ImageThumbnail);
