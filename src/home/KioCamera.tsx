import {View, StyleSheet, Dimensions} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {Camera, CameraType, FlashMode} from 'expo-camera';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import Photo from './camera/Photo';
import emitter from '../utils/emitter';
import Controls from './camera/Controls';
import PhotoPicker from './camera/PhotoPicker';
import {useVector} from 'react-native-redash';
import {clamp} from '../utils/animations';

const {width, height} = Dimensions.get('window');
const SIZE = (width / 4) * 0.75;
const PHOTO_SIZE = SIZE * 0.8;

const KioCamera: NavigationFunctionComponent = ({}) => {
  const scrollY = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(1);
  const scale = useSharedValue<number>(1);

  const [assets, setAssets] = useState<string[]>([]);
  const [flash, setFlash] = useState<FlashMode>(FlashMode.off);
  const [camera, setCamera] = useState<CameraType>(CameraType.back);

  const cameraRef = useRef<Camera>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const {uri} = await cameraRef.current.takePictureAsync();
      setAssets([uri, ...assets]);
      // await impactAsync(ImpactFeedbackStyle.Light);
    }
  };

  const showBottomShet = () => {
    scrollY.value = withTiming(-height / 2);
    opacity.value = withTiming(0);
  };

  const translate = useVector(0, 0);
  const offset = useVector(0, 0);
  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.x.value = translation.value.x;
      offset.y.value = translation.value.y;
    })
    .onChange(e => {
      translate.x.value = offset.x.value + e.translationX;
      translate.y.value = offset.y.value + e.translationY;
    });

  const translation = useDerivedValue(() => {
    const maxY = height - height * scale.value;
    const maxX = (width - width * scale.value) / 2;

    return {
      x: clamp(translate.x.value, -maxX, maxX),
      y: clamp(translate.y.value, 0, maxY),
    };
  });

  const rStyle = useAnimatedStyle(() => {
    scale.value = interpolate(
      scrollY.value,
      [0, -height * 0.7],
      [1, 0.25],
      Extrapolate.CLAMP,
    );

    const ty = (-1 * (height - height * scale.value)) / 2;
    return {
      elevation: 0,
      borderRadius:
        scrollY.value > -height / 2 ? withTiming(0) : withTiming(20),
      transform: [
        {translateY: ty},
        {translateY: translation.value.y},
        {translateX: translation.value.x},
        {scale: scale.value},
      ],
    };
  });

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
      <PhotoPicker scrollY={scrollY} opacity={opacity} />
      <GestureDetector gesture={pan}>
        <Animated.View style={[StyleSheet.absoluteFill, rStyle]}>
          <Camera
            ref={cameraRef}
            flashMode={flash}
            type={camera}
            style={styles.camera}>
            <Controls opacity={opacity} />
            <View style={styles.photoContainer}>
              <View style={styles.buttonContainer}>
                <TouchableWithoutFeedback
                  onPress={takePicture}
                  style={styles.outerButton}>
                  <View style={styles.innerButton} />
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.thumbnailContainer}>
                {assets.length > 0 && (
                  <TouchableWithoutFeedback
                    style={styles.photos}
                    onPress={showBottomShet}>
                    {assets.map(uri => {
                      return (
                        <Photo
                          uri={uri}
                          opacity={opacity}
                          key={`asset-${uri}`}
                        />
                      );
                    })}
                  </TouchableWithoutFeedback>
                )}
              </View>
            </View>
          </Camera>
        </Animated.View>
      </GestureDetector>
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
    elevation: 1,
  },
  photoContainer: {
    width,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photos: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    position: 'relative',
  },
  outerButton: {
    borderWidth: 5,
    borderColor: '#fff',
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerButton: {
    height: SIZE / 2,
    width: SIZE / 2,
    borderRadius: SIZE / 4,
    backgroundColor: '#ee3060',
  },
  buttonContainer: {
    width: width / 2 + SIZE / 2,
    alignItems: 'flex-end',
  },
  thumbnailContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

KioCamera.options = {
  bottomTabs: {
    visible: false,
  },
};

export default KioCamera;
