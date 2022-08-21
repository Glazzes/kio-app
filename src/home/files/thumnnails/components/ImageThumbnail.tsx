import {Dimensions, Image, Pressable, StyleSheet} from 'react-native';
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
import {Navigation} from 'react-native-navigation';
import emitter from '../../../../utils/emitter';
import authStore from '../../../../store/authStore';
import {Screens} from '../../../../enums/screens';
import {clamp} from '../../../../shared/functions/clamp';
import {pinch} from '../../../../utils/animations';
import {Dimension} from '../../../../shared/types';
import {File} from '../../../../utils/types';

type Reflection = {
  dimensions: Animated.SharedValue<Dimension>;
  translateX: Animated.SharedValue<number>;
  translateY: Animated.SharedValue<number>;
  scale: Animated.SharedValue<number>;
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ImageThumbnail: React.FC<ImageThumbnailProps & Reflection> = ({
  index,
  pic,
  translateX,
  translateY,
  scale,
  x,
  y,
  dimensions,
}) => {
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: SIZE,
    height: SIZE,
  });

  const accessToken = authStore(state => state.accessToken);

  const setPic = () => {
    emitter.emit('sp', pic);
  };

  const setEmpty = () => {
    emitter.emit('empty');
  };

  const pushToDetails = () => {
    Navigation.showModal({
      component: {
        name: Screens.IMAGE_DETAILS,
        passProps: {
          index,
          uri: pic,
          dimensions: imageDimensions,
        },
        options: {
          layout: {
            backgroundColor: 'transparent',
          },
          animations: {
            showModal: {
              sharedElementTransitions: [
                {
                  fromId: `img-${pic}-${index}`,
                  toId: `img-${pic}-${index}-dest`,
                  duration: 300,
                  interpolation: {
                    type: 'linear',
                  },
                },
              ],
            },
          },
        },
      },
    }).then(() => {
      os.value = 0;
    });
  };

  const aref = useAnimatedRef();
  const origin = useVector(0, 0);
  const canPinch = useSharedValue<boolean>(true);
  const opacity = useSharedValue<number>(1);
  const os = useSharedValue<number>(1);

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

      translateX.value = withTiming(0, undefined, hasFinished => {
        if (hasFinished) {
          runOnJS(setEmpty)();
          x.value = -height;
          y.value = -height;
          os.value = 1;
        }
      });

      translateY.value = withTiming(0);
    });

  const cc = useAnimatedStyle(() => ({
    opacity: os.value,
  }));

  useEffect(() => {
    const ss = emitter.addListener('sss', () => {
      os.value = 1;
    });

    Image.getSize(pic, (w: number, h: number) => {
      setImageDimensions({width: w, height: h});
    });

    return () => {
      ss.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatedPressable ref={aref} style={styles.root} onPress={pushToDetails}>
      <GestureDetector gesture={pinchG}>
        {/*
           Wrapping the view that's gonna be pinched within an animated view
           for some reason allows for a better pinch gesture
           */}

        <Animated.View style={[styles.thumb]}>
          <Animated.Image
            nativeID={`img-${pic}-${index}`}
            style={[styles.image, cc]}
            source={{uri: pic, headers: {Authorization: accessToken}}}
            resizeMode={'cover'}
          />
        </Animated.View>
      </GestureDetector>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  root: {
    width: SIZE,
    height: SIZE,
    backgroundColor: '#f3f3f3',
    borderRadius: 5,
  },
  thumbContainer: {
    overflow: 'hidden',
    borderRadius: 5,
  },
  thumb: {
    height: SIZE,
    width: SIZE,
    borderRadius: 5,
  },
  image: {
    flex: 1,
    borderRadius: 5,
  },
});

export default React.memo(ImageThumbnail);
