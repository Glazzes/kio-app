import {View, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {Camera, CameraType} from 'expo-camera';
import Animated, {
  Extrapolate,
  interpolate,
  Keyframe,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');

const onEntering = new Keyframe({
  from: {
    width,
    height,
    transform: [{translateX: 0, translateY: 0}],
  },
  to: {
    width: 100,
    height: 100,
    transform: [{translateX: width - 100}, {translateY: height - 100}],
  },
});

const KioCamera: NavigationFunctionComponent = ({}) => {
  const scale = useSharedValue<number>(1);
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  const pan = Gesture.Pan().onChange(e => {
    scale.value = interpolate(
      e.translationY,
      [-200, 0, 200],
      [0.25, 1, 0.25],
      Extrapolate.CLAMP,
    );
  });

  return (
    <View style={styles.root}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[StyleSheet.absoluteFill, rStyle]}>
          <Camera type={CameraType.front} style={{flex: 1}} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'salmon',
    alignItems: 'center',
  },
  camera: {
    width,
    height,
    position: 'absolute',
    transform: [{scale: 0.25}],
  },
});

KioCamera.options = {
  bottomTabs: {
    visible: false,
  },
};

export default KioCamera;
