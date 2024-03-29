import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {useVector} from 'react-native-redash';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import Controls from './Controls';
import PhotoPicker from '../picker/PhotoPicker';
import PictureThumbnail from '../picker/PictureThumbnail';
import emitter from '../../../shared/emitter';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import UploadPhotoFAB from './UploadPhotoFAB';
import {Screens} from '../../../enums/screens';
import {
  addTakenPicture,
  clearPictureSelection,
  getTakenPicturesUris,
} from '../../../store/photoStore';
import {getPictureName} from '../../utils/functions/getPictureName';
import {PicturePickerEvent} from '../../utils/enums';
import {clamp} from '../../../shared/functions/animations/clamp';

type AppCameraProps = {
  folderId: string;
  singlePicture: boolean;
};

const {width, height} = Dimensions.get('window');
const SIZE = (width / 4) * 0.75;
const PHOTO_SIZE = SIZE * 0.8;

const AppCamera: NavigationFunctionComponent<AppCameraProps> = ({
  componentId,
  folderId,
  singlePicture,
}) => {
  const devices = useCameraDevices();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [pictures, setPictures] = useState<string[]>(getTakenPicturesUris);

  const [isBackCamera, setIsBackCamera] = useState<boolean>(!singlePicture);
  const [authorized, setAuthorized] = useState<boolean>(false);

  const flash = useRef<boolean>(false);
  const cameraRef = useRef<Camera>(null);

  const cameraScale = useSharedValue<number>(1);

  const takePicture = async () => {
    if (cameraRef.current && scrollY.value > -height / 2) {
      await impactAsync(ImpactFeedbackStyle.Medium);

      cameraScale.value = withSequence(withTiming(0.75), withSpring(1));
      opacity.value = withTiming(0);

      const {path} = await cameraRef.current.takePhoto({
        flash: flash.current ? 'on' : 'off',
        skipMetadata: false,
        qualityPrioritization: 'speed',
      });

      opacity.value = withTiming(1);
      const uri = Platform.OS === 'android' ? 'file://' + path : path;

      if (singlePicture) {
        Image.getSize(uri, (w, h) => {
          Navigation.push(componentId, {
            component: {
              name: Screens.EDITOR,
              passProps: {
                uri: uri,
                width: w,
                height: h,
              },
            },
          });
        });

        return;
      }

      setPictures(a => [...a, uri]);

      const pictureName = getPictureName();
      addTakenPicture(uri, {
        name: pictureName,
        width: 1,
        height: 1,
      });
    }
  };

  const snap = useSharedValue<boolean>(false);
  const translateCameraY = useSharedValue<number>(0);
  const containerHeight = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(1);
  const scrollY = useSharedValue<number>(0);
  const scale = useSharedValue<number>(1);

  const translate = useVector(0, 0);
  const offset = useVector(0, 0);

  const translation = useDerivedValue(() => {
    const maxY = height - height * scale.value;
    const maxX = (width - width * scale.value) / 2;

    return {
      x: clamp(translate.x.value, -maxX, maxX),
      y: clamp(translate.y.value, 0, maxY),
    };
  }, [scrollY, scale, translate.x, translate.y]);

  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.x.value = translation.value.x;
      offset.y.value = translation.value.y;
    })
    .onChange(e => {
      if (scrollY.value <= -height * 0.7) {
        translate.x.value = offset.x.value + e.translationX;
        translate.y.value = offset.y.value + e.translationY;
      }
    });

  const showBottomShet = () => {
    translateCameraY.value = withTiming(
      -(containerHeight.value - SIZE) / 2 + SIZE,
    );
    scrollY.value = withTiming(-height / 2);
    opacity.value = withTiming(0);
  };

  const tap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(_ => {
      scrollY.value = withTiming(0);
      translate.x.value = withTiming(0);
      translate.y.value = withTiming(0);
      translateCameraY.value = withTiming(0);
      opacity.value = withTiming(1);
    });

  const combinedGesture = Gesture.Exclusive(pan, tap);

  const rStyle = useAnimatedStyle(() => {
    scale.value = interpolate(
      scrollY.value,
      [0, -height * 0.7],
      [1, 0.25],
      Extrapolate.CLAMP,
    );

    const ty = (-1 * (height - height * scale.value)) / 2;
    const condition = scrollY.value <= -height / 2;
    return {
      borderRadius: condition ? withTiming(20) : withTiming(0),
      transform: [
        {translateY: ty},
        {translateY: translation.value.y},
        {translateX: translation.value.x},
        {scale: scale.value},
      ],
    };
  });

  const buttonStyles = useAnimatedStyle(() => ({
    transform: [
      {translateY: translateCameraY.value},
      {scale: cameraScale.value},
    ],
  }));

  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermission();
      setAuthorized(result === 'authorized');
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

  useAnimatedReaction(
    () => snap.value,
    s => {
      if (s) {
        opacity.value = withTiming(1);
        translate.x.value = withTiming(0);
        translate.y.value = withTiming(0);
        translateCameraY.value = withTiming(0);
        snap.value = false;
      }
    },
  );

  useAnimatedReaction(
    () => scrollY.value,
    y => {
      if (y >= -height * 0.7) {
        translate.x.value = withTiming(0);
        translate.y.value = withTiming(0);
      }
    },
  );

  useEffect(() => {
    const listener = Navigation.events().registerComponentListener(
      {
        componentWillAppear: () => setIsActive(true),
        componentDidDisappear: () => setIsActive(false),
      },
      componentId,
    );

    const removePictures = emitter.addListener(
      PicturePickerEvent.REMOVE_PICTURES,
      (uris: string[]) => {
        setPictures(ps => {
          return ps.filter(uri => !uris.includes(uri));
        });
      },
    );

    return () => {
      listener.remove();
      removePictures.remove();
      clearPictureSelection();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (devices.back == null || devices.front == null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <PhotoPicker snap={snap} scrollY={scrollY} photos={pictures} />
      <UploadPhotoFAB componentId={componentId} folderId={folderId} />

      <GestureDetector gesture={combinedGesture}>
        <Animated.View
          style={[styles.cameraContainer, rStyle]}
          onLayout={e => {
            containerHeight.value = e.nativeEvent.layout.height;
          }}>
          {authorized && (
            <View style={styles.cameraContainer}>
              <Camera
                ref={cameraRef}
                isActive={isActive}
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
                  {pictures.length > 0 && (
                    <TouchableWithoutFeedback onPress={showBottomShet}>
                      <View style={styles.photos}>
                        {pictures.map(uri => {
                          return (
                            <PictureThumbnail
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
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

AppCamera.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
  sideMenu: {
    right: {
      enabled: false,
      visible: false,
    },
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
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
    alignItems: 'flex-end',
  },
  buttonOuterContent: {
    borderWidth: 5,
    borderColor: '#fff',
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
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
