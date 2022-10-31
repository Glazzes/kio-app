import {Dimensions, Image, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import emitter from '../../../../utils/emitter';
import authState from '../../../../store/authStore';
import {clamp} from '../../../../shared/functions/clamp';
import {pinch} from '../../../../utils/animations';
import {Dimension, File} from '../../../../shared/types';
import {useSnapshot} from 'valtio';
import {SIZE} from '../utils/constants';
import {pushToImageDetails} from '../../../../shared/functions/navigation/pushToImageDetails';
import {host} from '../../../../shared/constants';

type Reflection = {
  dimensions: Animated.SharedValue<Dimension>;
  translateX: Animated.SharedValue<number>;
  translateY: Animated.SharedValue<number>;
  scale: Animated.SharedValue<number>;
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
};

type ImageThumbnailProps = {
  file: File;
  pic: string;
};

const {height} = Dimensions.get('window');

const center = {
  x: SIZE / 2,
  y: SIZE / 2,
};

const ImageThumbnail: React.FC<ImageThumbnailProps & Reflection> = ({
  file,
  pic,
  translateX,
  translateY,
  scale,
  x,
  y,
  dimensions,
}) => {
  const uri = `${host}/static/file/${file.id}`;

  const {accessToken} = useSnapshot(authState.tokens);

  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: SIZE,
    height: SIZE,
  });

  const setPic = () => {
    emitter.emit('sp', uri);
  };

  const setEmpty = () => {
    emitter.emit('empty');
  };

  const aref = useAnimatedRef<View>();
  const origin = useVector(0, 0);
  const canPinch = useSharedValue<boolean>(true);
  const opacity = useSharedValue<number>(1);

  const pinchG = Gesture.Pinch()
    .hitSlop({vertical: 20, horizontal: 20})
    .onStart(() => {
      runOnJS(setPic)();
      const {pageX, pageY} = measure(aref);
      x.value = pageX;
      y.value = pageY;

      dimensions.value = imageDimensions;

      opacity.value = withTiming(0, {duration: 100}, hasFinished => {
        if (hasFinished) {
          opacity.value = 0;
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

      translateX.value = withTiming(0, undefined, hasFinished => {
        if (hasFinished) {
          runOnJS(setEmpty)();
          x.value = -height;
          y.value = -height;
          opacity.value = 1;
        }
      });

      translateY.value = withTiming(0);
    });

  const cc = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    Image.getSize(pic, (w: number, h: number) => {
      setImageDimensions({width: w, height: h});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const push = emitter.addListener(`push-${file.id}-image`, () => {
      pushToImageDetails(file, pic, opacity, imageDimensions);
    });

    return () => {
      push.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageDimensions]);

  return (
    <View style={styles.root} ref={aref}>
      <GestureDetector gesture={pinchG}>
        {/*
           Wrapping the view that's gonna be pinched within an animated view
           for some reason allows for a better pinch gesture
           */}

        <Animated.View style={[styles.thumb]}>
          <Animated.Image
            nativeID={`img-${file.id}`}
            style={[styles.image, cc]}
            source={{
              uri: `${host}/static/file/${file.id}`,
              headers: {Authorization: `Bearer ${accessToken}`},
            }}
            resizeMode={'cover'}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: SIZE,
    height: SIZE,
    backgroundColor: '#f3f3f3',
    borderRadius: 5,
  },
  thumb: {
    width: SIZE,
    height: SIZE,
  },
  thumbContainer: {
    overflow: 'hidden',
    borderRadius: 5,
  },
  image: {
    flex: 1,
    borderRadius: 5,
  },
});

export default React.memo(ImageThumbnail);
