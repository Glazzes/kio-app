import {View, Dimensions, StyleSheet, Button} from 'react-native';
import React from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import SVG, {Path} from 'react-native-svg';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import {useVector} from 'react-native-redash';
import {clamp, pinch, cropPoint} from '../../utils/animations';
import ImageEditor from '@react-native-community/image-editor';

type EditorProps = {
  uri: string;
  width: string;
  height: string;
};

const {width, height} = Dimensions.get('window');
const R = (width / 2) * 0.8;
const center = {x: width / 2, y: height * 0.4};
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

const Editor: NavigationFunctionComponent<EditorProps> = ({componentId}) => {
  const d = {w: 801, h: 1200};
  const s = {
    width: R * 2,
    height: undefined,
    maxHeight: undefined,
    aspectRatio: d.w / d.h,
  };

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
      offset.x.value = translation.value.x;
      offset.y.value = translation.value.y;
      cancelAnimation(translate.x);
      cancelAnimation(translate.y);
    })
    .onChange(e => {
      translate.x.value = offset.x.value + e.translationX;
      translate.y.value = offset.y.value + e.translationY;

      const {originX, originY, size} = cropPoint(
        {width: d.w, height: d.h},
        layout,
        {x: translation.value.x, y: translation.value.y},
        scale.value,
        R,
      );

      console.log(originX, originY, size);
    })
    .onEnd(({velocityX, velocityY}) => {
      translate.x.value = withDecay({velocity: velocityX});
      translate.y.value = withDecay({velocity: velocityY});
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(_ => {
      offset.x.value = translation.value.x;
      offset.y.value = translation.value.y;
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

  const gesture = Gesture.Exclusive(pan, pinchGesture);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translation.value.x},
        {translateY: translation.value.y},
        {scale: scale.value},
      ],
    };
  });

  const effectStyles = useAnimatedStyle(() => {
    return {
      transform: [{rotateY: `${0}rad`}, {rotateX: `${0}rad`}],
    };
  });

  const crop = async () => {
    const {originX, originY, size} = cropPoint(
      {width: d.w, height: d.h},
      layout,
      {x: translation.value.x, y: translation.value.y},
      scale.value,
      R,
    );

    const uri = await ImageEditor.cropImage(
      'file:///storage/sdcard0/Descargas/dalmatian.jpg',
      {
        offset: {x: originX, y: originY},
        size: {height: size, width: size},
        displaySize: {width: 200, height: 200},
        resizeMode: 'cover',
      },
    );

    Navigation.push(componentId, {
      component: {
        name: 'Result',
        passProps: {
          uri,
        },
      },
    });
  };

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.container, rStyle]}>
        <Animated.Image
          onLayout={e => {
            layout.x.value = e.nativeEvent.layout.width;
            layout.y.value = e.nativeEvent.layout.height;
          }}
          source={dalmatian}
          style={[s, effectStyles]}
        />
      </Animated.View>
      <SVG width={width} height={height} style={StyleSheet.absoluteFillObject}>
        <Path d={path.join(' ')} fill={'rgba(0, 0, 0, 0.4)'} />
      </SVG>
      <View style={styles.reflection}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[s, rStyle]} />
        </GestureDetector>
      </View>
      <View style={{position: 'absolute'}}>
        <Button title="crop" onPress={crop} />
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
  },
  container: {
    width,
    height: height * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reflection: {
    position: 'absolute',
    width,
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Editor;
