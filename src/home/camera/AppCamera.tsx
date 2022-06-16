import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useVector} from 'react-native-redash';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import Controls from './Controls';
import PhotoPicker from './picker/PhotoPicker';
import {clamp} from '../../utils/animations';
import Photo from './picker/Photo';
import emitter from '../../utils/emitter';

type AppCameraProps = {};

const {width, height} = Dimensions.get('window');
const SIZE = (width / 4) * 0.75;
const PHOTO_SIZE = SIZE * 0.8;

const AppCamera: NavigationFunctionComponent<AppCameraProps> = ({}) => {
  const devices = useCameraDevices();

  const [photos, setPhotos] = useState<string[]>([]);
  const [isBackCamera, setIsBackCamera] = useState<boolean>(true);

  const authorized = useRef<boolean>(false);
  const flash = useRef<boolean>(false);
  const cameraRef = useRef<Camera>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const {path} = await cameraRef.current.takePhoto({
        flash: flash.current ? 'on' : 'off',
        skipMetadata: true,
        qualityPrioritization: 'speed',
      });

      const endPath = Platform.OS === 'android' ? 'file://' + path : path;
      setPhotos(a => [...a, endPath]);
    }
  };

  const translateCameraY = useSharedValue<number>(0);
  const containerHeight = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(1);
  const scrollY = useSharedValue<number>(0);
  const scale = useSharedValue<number>(1);

  const translate = useVector(0, 0);
  const offset = useVector(0, 0);

  const showBottomShet = () => {
    translateCameraY.value = withTiming(
      -(containerHeight.value - SIZE) / 2 + SIZE,
    );
    scrollY.value = withSpring(-height / 2);
    opacity.value = withTiming(0);
  };

  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.x.value = translate.x.value;
      offset.y.value = translate.y.value;
    })
    .onChange(e => {
      translate.x.value = offset.x.value + e.translationX;
      translate.y.value = offset.y.value + e.translationY;
    });

  const tap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(_ => {
      if (scrollY.value <= -height / 2) {
        translate.x.value = withTiming(0);
        translate.y.value = withTiming(0);
        translateCameraY.value = withTiming(0);
      }
    });

  const combinedGesture = Gesture.Exclusive(pan, tap);

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
    const condition = scrollY.value > -height / 2;
    return {
      elevation: condition ? withTiming(0) : withTiming(5),
      borderRadius: condition ? withTiming(0) : withTiming(20),
      transform: [
        {translateY: ty},
        {translateY: translation.value.y},
        {translateX: translation.value.x},
        {scale: scale.value},
      ],
    };
  });

  const buttonStyles = useAnimatedStyle(() => ({
    transform: [{translateY: translateCameraY.value}],
  }));

  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermission();
      authorized.current = result === 'authorized';
    })();

    const toggleFlash = emitter.addListener('toggle.flash', () => {
      flash.current = !flash.current;
    });

    const flipCamera = emitter.addListener('flip.camera', () => {
      setIsBackCamera(b => !b);
    });

    return () => {
      toggleFlash.remove();
      flipCamera.remove();
    };
  }, []);

  if (devices.back == null || devices.front == null) {
    return null;
  }

  return (
    <View style={styles.root}>
      <PhotoPicker opacity={opacity} scrollY={scrollY} photos={photos} />
      <GestureDetector gesture={combinedGesture}>
        <Animated.View
          style={[styles.cameraContainer, rStyle]}
          onLayout={e => {
            containerHeight.value = e.nativeEvent.layout.height;
          }}>
          <Camera
            ref={cameraRef}
            isActive={true}
            device={isBackCamera ? devices.back : devices.front}
            photo={true}
            style={styles.camera}
          />
          <Controls opacity={opacity} />
          <View style={styles.photoContainer}>
            <View style={styles.buttonContainer}>
              <Animated.View style={buttonStyles}>
                <TouchableWithoutFeedback onPress={takePicture}>
                  <View style={styles.buttonOuterContent}>
                    <View style={styles.buttonInnerContent} />
                  </View>
                </TouchableWithoutFeedback>
              </Animated.View>
            </View>
            <View style={styles.thumbnailContainer}>
              {photos.length > 0 && (
                <TouchableWithoutFeedback onPress={showBottomShet}>
                  <View style={styles.photos}>
                    {photos.map(uri => {
                      return (
                        <Photo
                          uri={uri}
                          opacity={opacity}
                          key={`asset-${uri}`}
                        />
                      );
                    })}
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

AppCamera.options = {
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
  cameraContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  camera: {
    width,
    height,
    position: 'absolute',
  },
  photoContainer: {
    width,
    flexDirection: 'row',
  },
  buttonContainer: {
    width: width / 2 + SIZE / 2,
  },
  buttonOuterContent: {
    borderWidth: 5,
    borderColor: '#fff',
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  buttonInnerContent: {
    height: SIZE / 2,
    width: SIZE / 2,
    borderRadius: SIZE / 4,
    backgroundColor: '#ee3060',
  },
  thumbnailContainer: {
    flex: 1,
    alignItems: 'center',
  },
  photos: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
  },
});

export default AppCamera;
