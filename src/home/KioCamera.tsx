import {View, StyleSheet, Dimensions} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {Camera, CameraType, FlashMode} from 'expo-camera';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import Photo from './camera/Photo';
import emitter from '../utils/emitter';
import Controls from './camera/Controls';
import PhotoPicker from './camera/PhotoPicker';

const {width, height} = Dimensions.get('window');
const SIZE = width / 4;

const KioCamera: NavigationFunctionComponent = ({}) => {
  const translateY = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(1);

  const [assets, setAssets] = useState<string[]>([]);
  const [flash, setFlash] = useState<FlashMode>(FlashMode.off);
  const [camera, setCamera] = useState<CameraType>(CameraType.front);

  const cameraRef = useRef<Camera>(null);

  const rStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateY.value,
      [0, -height],
      [1, 0.25],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{scale}],
    };
  });

  const takePicture = async () => {
    if (cameraRef.current) {
      const {uri} = await cameraRef.current.takePictureAsync();
      setAssets(prev => [...prev, uri]);
      await impactAsync(ImpactFeedbackStyle.Light);
    }
  };

  useEffect(() => {
    const toggleFlash = emitter.addListener('toggle.flash', () => {
      setFlash(f => (f === FlashMode.off ? FlashMode.on : FlashMode.off));
    });

    const flipCamera = emitter.addListener('flip.camera', () => {
      setCamera(c =>
        c === CameraType.back ? CameraType.front : CameraType.back,
      );
    });

    return () => {
      toggleFlash.remove();
      flipCamera.remove();
    };
  }, []);

  return (
    <View style={styles.root}>
      <Animated.View style={[StyleSheet.absoluteFill, rStyle]}>
        <Camera
          ref={cameraRef}
          flashMode={flash}
          type={camera}
          style={styles.camera}>
          <Controls />
          <TouchableWithoutFeedback
            onPress={takePicture}
            style={styles.outerButton}>
            <View style={styles.innerButton} />
          </TouchableWithoutFeedback>
        </Camera>
      </Animated.View>

      {assets.map(uri => {
        return (
          <Photo
            uri={uri}
            opacity={opacity}
            translateY={translateY}
            key={`asset-${uri}`}
          />
        );
      })}
      <PhotoPicker translateY={translateY} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerButton: {
    borderWidth: 5,
    borderColor: '#fff',
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerButton: {
    height: SIZE / 2,
    width: SIZE / 2,
    borderRadius: SIZE / 4,
    backgroundColor: '#ee3060',
  },
});

KioCamera.options = {
  bottomTabs: {
    visible: false,
  },
};

export default KioCamera;
