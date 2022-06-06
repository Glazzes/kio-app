import {View, StyleSheet, Dimensions, Image as RImage} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useVector} from 'react-native-redash';
import {set} from '../utils/animations';
import {
  BackdropBlur,
  Canvas,
  Fill,
  Group,
  Image,
  ImageShader,
  LinearGradient,
  Turbulence,
  Paint,
  Rect,
  useImage,
  vec,
  FractalNoise,
  DisplacementMap,
  BackdropFilter,
  Blur,
} from '@shopify/react-native-skia';

const {width} = Dimensions.get('window');

const Notifications: NavigationFunctionComponent = ({}) => {
  const image = useImage(require('./rikki.jpg'));

  if (image == null) {
    return null;
  }

  return (
    <View style={styles.root}>
      <Canvas style={styles.canvas}>
        <Image
          fit={'cover'}
          image={image}
          x={0}
          y={0}
          width={width}
          height={width}
        />
        <BackdropFilter
          filter={<Blur blur={4} />}
          clip={{
            x: 0,
            y: width / 2,
            width,
            height: width / 2,
          }}>
          <Rect x={0} y={0} width={width} height={width}>
            <FractalNoise freqX={0.05} freqY={0.05} octaves={4} />
            <Blur blur={4} />
          </Rect>
        </BackdropFilter>
      </Canvas>
    </View>
  );
};

Notifications.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 320,
    maxWidth: 320,
    height: 320,
    maxHeight: undefined,
  },
  canvas: {
    width,
    height: width,
    backgroundColor: 'pink',
  },
});

export default Notifications;
