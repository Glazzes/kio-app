import {Dimensions, StyleSheet, ViewStyle} from 'react-native';
import React, {useEffect} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import {snapPoint, useVector} from 'react-native-redash';
import {clamp, imageStyles, pinch, set} from '../../../utils/animations';
import {maxScale} from '../../../settings/editor/utils';
import {Dimension} from '../../../shared/types';
import emitter from '../../../utils/emitter';

type ImageDetailsProps = {
  index: number;
  uri: string;
  dimensions: Dimension;
};

const {width, height} = Dimensions.get('window');

const ImageDetails: NavigationFunctionComponent<ImageDetailsProps> = ({
  componentId,
  index,
  uri,
  dimensions,
}) => {
  const imageS: ViewStyle = imageStyles(dimensions);

  const layout = useVector(1, 1);
  const translate = useVector(0, 0);
  const offset = useVector(0, 0);

  const scale = useSharedValue<number>(1);
  const scaleOffset = useSharedValue<number>(1);

  const origin = useVector(0, 0);
  const originAssign = useSharedValue<boolean>(true);

  const translation = useDerivedValue<{x: number; y: number}>(() => {
    const offsetX = Math.max((layout.x.value * scale.value - width) / 2, 0);
    const offsetY = Math.max((layout.y.value * scale.value - height) / 2, 0);

    const x = clamp(translate.x.value, -offsetX, offsetX);
    const y = clamp(translate.y.value, -offsetY, offsetY);

    return {x, y};
  }, [translate.x.value, translate.y.value, scale.value]);

  const backgroundColor = useDerivedValue(() => {
    return scale.value === 1
      ? interpolateColor(
          translate.y.value,
          [-height / 2, 0, height / 2],
          ['transparent', 'rgba(0, 0, 0, 1)', 'transparent'],
          'RGB',
        )
      : 'rgba(0, 0, 0, 1)';
  }, [translate.y.value]);

  const wrapper = () => {
    emitter.emit('sss');
    Navigation.dismissModal(componentId, {
      animations: {
        dismissModal: {
          sharedElementTransitions: [
            {
              fromId: `img-${uri}-${index}-dest`,
              toId: `img-${uri}-${index}`,
              duration: 300,
              interpolation: {
                type: 'linear',
              },
            },
          ],
        },
      },
    });
  };

  const pan = Gesture.Pan()
    .maxPointers(1)
    .onStart(_ => {
      offset.x.value = translation.value.x;
      offset.y.value = translation.value.y;
    })
    .onChange(e => {
      translate.x.value = offset.x.value + e.translationX;
      translate.y.value = offset.y.value + e.translationY;
    })
    .onEnd(({velocityX, velocityY}) => {
      const snap = snapPoint(translate.y.value, velocityY, [
        -height,
        0,
        height,
      ]);

      if (scale.value === 1) {
        if (snap === -height || snap === height) {
          runOnJS(wrapper)();
        }

        if (snap === 0) {
          translate.y.value = withTiming(0);
          offset.y.value = withTiming(0);
        }

        return;
      }

      translate.x.value = withDecay({velocity: velocityX});
      translate.y.value = withDecay({velocity: velocityY});
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      offset.x.value = translation.value.x;
      offset.y.value = translation.value.y;
      scaleOffset.value = scale.value;
    })
    .onChange(e => {
      const {translateX, translateY} = pinch(
        {x: layout.x.value / 2, y: layout.y.value / 2},
        {x: offset.x.value, y: offset.y.value},
        e,
        {x: origin.x, y: origin.y},
        originAssign,
      );

      translate.x.value = offset.x.value + translateX;
      translate.y.value = offset.y.value + translateY;
      scale.value = scaleOffset.value * e.scale;
    })
    .onEnd(_ => {
      originAssign.value = true;
      if (scale.value < 1) {
        scale.value = withTiming(1);
        set(translate, 0);
        set(offset, 0);
      }
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(e => {
      const toMaxScale = maxScale(layout, dimensions, 0);

      let toScale = scale.value * 2;
      if (toScale > toMaxScale) {
        toScale = 1;
      }

      const {translateX, translateY} = pinch(
        {x: layout.x.value / 2, y: layout.y.value / 2},
        {x: offset.x.value, y: offset.y.value},
        {focalX: e.x, focalY: e.y, scale: toScale},
        {x: origin.x, y: origin.y},
        originAssign,
      );

      if (toScale === 1) {
        translate.y.value = withTiming(0);
      } else {
        translate.y.value = withTiming(offset.y.value + translateY);
      }
      translate.x.value = withTiming(offset.x.value + translateX);
      scale.value = withTiming(toScale);
    })
    .onFinalize(() => {
      originAssign.value = true;
    });

  const combinedGesture = Gesture.Exclusive(pan, pinchGesture, doubleTap);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translation.value.x},
        {
          translateY:
            scale.value === 1 ? translate.y.value : translation.value.y,
        },
        {scale: scale.value},
      ],
    };
  });

  const rootRStyles = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  useEffect(() => {
    const backListener =
      Navigation.events().registerNavigationButtonPressedListener(e => {
        if (e.buttonId === 'RNN.hardwareBackButton') {
          wrapper();
        }
      });

    return () => backListener.remove();
  }, []);

  return (
    <Animated.View style={[styles.root, rootRStyles]} nativeID={'bg'}>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={imageS}>
          <Animated.Image
            onLayout={({nativeEvent}) => {
              layout.x.value = nativeEvent.layout.width;
              layout.y.value = nativeEvent.layout.height;
            }}
            nativeID={`img-${uri}-${index}-dest`}
            source={{uri}}
            resizeMethod={'scale'}
            resizeMode={'cover'}
            style={[imageS as any, rStyle]}
          />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

ImageDetails.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
  layout: {
    backgroundColor: 'transparent',
  },
  hardwareBackButton: {
    dismissModalOnPress: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageDetails;
