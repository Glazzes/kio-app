import {View, Dimensions, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import SVG, {Path} from 'react-native-svg';
import FastImage from 'react-native-fast-image';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import {useVector} from 'react-native-redash';
import {clamp, pinch} from '../../utils/animations';

type EditorProps = {};

const {width, height} = Dimensions.get('window');
const R = (width / 2) * 0.8;
const center = {x: width / 2, y: height / 2};
const path = [
  'M 0 0',
  `h ${width}`,
  `v ${height}`,
  `h ${-width}`,
  `v ${-height}`,
  `M ${center.x - R} ${center.y}`,
  `a 1 1 0 0 0 ${R * 2} 0`,
  `a 1 1 0 0 0 ${-R * 2} 0`,
];

const dalmatian = require('./dalmatian.jpg');

const Editor: NavigationFunctionComponent<EditorProps> = ({}) => {
  const d = {w: 801, h: 1200};
  const layout = useVector(0, 0);

  const translate = useVector(0, 0);
  const offset = useVector(0, 0);

  const scale = useSharedValue<number>(1);
  const scaleOffset = useSharedValue<number>(1);

  const origin = useVector(0, 0);
  const originAssign = useSharedValue<boolean>(true);

  const translation = useDerivedValue<{x: number; y: number}>(() => {
    const offsetX = (layout.x.value * scale.value - R * 2) / 2;
    const offsetY = (layout.y.value * scale.value - R * 2) / 2;

    const x = clamp(-offsetX, translate.x.value, offsetX);
    const y = clamp(-offsetY, translate.y.value, offsetY);

    return {x, y};
  }, [translate.x.value, translate.y.value, scale.value]);

  const pan = Gesture.Pan()
    .maxPointers(1)
    .onStart(_ => {
      offset.x.value = translate.x.value;
      offset.y.value = translate.y.value;
      cancelAnimation(translate.x);
      cancelAnimation(translate.y);
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
    .onBegin(_ => {
      offset.x.value = translate.x.value;
      offset.y.value = translate.y.value;
      scaleOffset.value = scale.value;
    })
    .onChange(e => {
      const {translateX, translateY} = pinch(
        layout,
        offset,
        e,
        originAssign,
        origin,
      );

      translate.x.value = translateX;
      translate.y.value = translateY;
      scale.value = clamp(
        1,
        e.scale * scaleOffset.value,
        Math.floor(d.h / layout.y.value),
      );
    })
    .onEnd(_ => {
      originAssign.value = true;
    });

  const gesture = Gesture.Race(pan, pinchGesture);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translation.value.x},
        {translateY: translation.value.y},
        {scale: scale.value},
      ],
    };
  });

  return (
    <View style={styles.root}>
      <Animated.View style={rStyle}>
        <FastImage
          onLayout={e => {
            layout.x.value = e.nativeEvent.layout.width;
            layout.y.value = e.nativeEvent.layout.height;
          }}
          source={dalmatian}
          style={{
            width: R * 2,
            height: undefined,
            maxHeight: undefined,
            aspectRatio: d.w / d.h,
          }}
        />
      </Animated.View>
      <SVG width={width} height={height} style={StyleSheet.absoluteFillObject}>
        <Path d={path.join(' ')} fill={'rgba(0, 0, 0, 0.4)'} />
      </SVG>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={rStyle}>
            <FastImage
              onLayout={e => {
                layout.x.value = e.nativeEvent.layout.width;
                layout.y.value = e.nativeEvent.layout.height;
              }}
              source={dalmatian}
              style={{
                opacity: 0.3,
                backgroundColor: 'tomato',
                width: R * 2,
                height: undefined,
                maxHeight: undefined,
                aspectRatio: d.w / d.h,
              }}
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

Editor.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
  bottomTabs: {
    visible: false,
    animate: true,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Editor;
