import {View, Dimensions, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import {useVector} from 'react-native-redash';
import {clamp, imageStyles, pinch, set} from '../../../utils/animations';
import {maxScale} from '../../../settings/editor/utils';

type ImageDetailsProps = {};

const uri = 'file:///storage/sdcard0/Descargas/fox.jpg';

const {width, height} = Dimensions.get('window');

const ImageDetails: NavigationFunctionComponent<ImageDetailsProps> = () => {
  const [d, setD] = useState({width: 1, height: 1});
  const s = imageStyles(d);

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
      const toMaxScale = maxScale(layout, d, 0);

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

      translate.x.value = withTiming(offset.x.value + translateX);
      translate.y.value = withTiming(offset.y.value + translateY);
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
        {translateY: translation.value.y},
        {scale: scale.value},
      ],
    };
  });

  useEffect(() => {
    Image.getSize(uri, (w, h) => {
      setD({width: w, height: h});
    });
  }, []);

  return (
    <View style={styles.root} nativeID={'bg'}>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={s}>
          <Animated.Image
            onLayout={({nativeEvent}) => {
              layout.x.value = nativeEvent.layout.width;
              layout.y.value = nativeEvent.layout.height;
            }}
            nativeID="img-dest"
            source={{uri}}
            resizeMethod={'scale'}
            resizeMode={'cover'}
            style={[s, rStyle]}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

ImageDetails.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
  bottomTabs: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageDetails;
