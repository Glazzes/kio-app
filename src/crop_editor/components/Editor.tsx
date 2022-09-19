import {View, Dimensions, StyleSheet, Pressable} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useVector} from 'react-native-redash';
import {clamp, pinch, set} from '../../utils/animations';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlipType, manipulateAsync, SaveFormat} from 'expo-image-manipulator';
import EffectIndicator from './EffectIndicator';
import crop from '../utils/functions/crop';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import emitter from '../../utils/emitter';
import {findLastByName} from '../../store/navigationStore';
import getImageStyles from '../utils/functions/getImageStyles';
import {getMaxImageScale} from '../utils/functions/getMaxImageScale';
import {Canvas, Skia, Path} from '@shopify/react-native-skia';

type CropEditorProps = {
  uri: string;
  width: number;
  height: number;
};

const {width, height} = Dimensions.get('window');
const R = (width * 0.8) / 2;
const center = {x: width / 2, y: height * 0.4};

const path = Skia.Path.MakeFromSVGString(
  `M 0 0 h ${width} v ${height} h ${-width} v ${-height} M ${center.x - R} ${
    center.y
  } a 1 1 0 0 0 ${R * 2} 0 a 1 1 0 0 0 ${-R * 2} 0`,
);

const CROP_SIZE = 180;
const TIMING_CONFIG = {duration: 150};

const CropEditor: NavigationFunctionComponent<CropEditorProps> = ({
  componentId,
  uri: imagePath,
  width: imageWidth,
  height: imageHeight,
}) => {
  const imageStyle = useMemo(() => {
    return getImageStyles({width: imageWidth, height: imageHeight}, R);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const layout = useVector(0, 0);
  const original = useVector(0, 0);

  const rotateImage = useSharedValue<number>(0);
  const rotate = useVector(0, 0);

  const translate = useVector(0, 0);
  const offset = useVector(0, 0);
  const delta = useVector(0, 0);

  const scale = useSharedValue<number>(1);
  const scaleOffset = useSharedValue<number>(1);

  const origin = useVector(0, 0);
  const originAssign = useSharedValue<boolean>(true);

  const bounds = useDerivedValue(() => {
    return {
      x: (layout.x.value * scale.value - R * 2) / 2,
      y: (layout.y.value * scale.value - R * 2) / 2,
    };
  }, [layout, scale]);

  const translation = useDerivedValue<{x: number; y: number}>(() => {
    const x = clamp(
      translate.x.value,
      -(bounds.value.x + R * 2),
      bounds.value.x + R * 2,
    );
    const y = clamp(
      translate.y.value,
      -(bounds.value.y + R * 2),
      bounds.value.y + R * 2,
    );

    return {x, y};
  }, [translate, scale, bounds]);

  const pan = Gesture.Pan()
    .maxPointers(1)
    .onStart(_ => {
      offset.x.value = translation.value.x;
      offset.y.value = translation.value.y;
    })
    .onChange(e => {
      const x = offset.x.value + e.translationX;
      const y = offset.y.value + e.translationY;

      const withinBoundsX = x >= -bounds.value.x && x <= bounds.value.x;
      const withinBoundsY = y >= -bounds.value.y && y <= bounds.value.y;

      delta.x.value = e.translationX - delta.x.value;
      delta.y.value = e.translationY - delta.y.value;

      const diffX = Math.abs(Math.abs(translate.x.value) - bounds.value.x);
      const diffY = Math.abs(Math.abs(translate.y.value) - bounds.value.y);

      if (withinBoundsX && withinBoundsY) {
        translate.x.value = offset.x.value + e.translationX;
        translate.y.value = offset.y.value + e.translationY;
      } else {
        translate.x.value +=
          delta.x.value *
          (withinBoundsX ? 1 : 0.75 * (1 - diffX / (R * 2)) ** 2);

        translate.y.value +=
          delta.y.value *
          (withinBoundsY ? 1 : 0.75 * (1 - diffY / (R * 2)) ** 2);
      }

      delta.x.value = e.translationX;
      delta.y.value = e.translationY;
    })
    .onEnd(() => {
      delta.x.value = 0;
      delta.y.value = 0;

      if (
        translate.x.value < -bounds.value.x ||
        translate.x.value > bounds.value.x
      ) {
        translate.x.value = withTiming(
          Math.sign(translate.x.value) * bounds.value.x,
          TIMING_CONFIG,
        );
      }

      if (
        translate.y.value < -bounds.value.y ||
        translate.y.value > bounds.value.y
      ) {
        translate.y.value = withTiming(
          Math.sign(translate.y.value) * bounds.value.y,
          TIMING_CONFIG,
        );
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(_ => {
      offset.x.value = translation.value.x;
      offset.y.value = translation.value.y;
      scaleOffset.value = scale.value;
    })
    .onChange(e => {
      const maxinumScale = getMaxImageScale(
        {width: layout.x.value, height: layout.y.value},
        {width: imageWidth, height: imageHeight},
        rotateImage.value,
      );

      const {translateX, translateY} = pinch(
        {x: layout.x.value / 2, y: layout.y.value / 2},
        {x: offset.x.value, y: offset.y.value},
        e,
        origin,
        originAssign,
      );

      const x = offset.x.value + translateX;
      const y = offset.y.value + translateY;

      translate.x.value = clamp(x, -bounds.value.x, bounds.value.x);
      translate.y.value = clamp(y, -bounds.value.y, bounds.value.y);
      scale.value = clamp(e.scale * scaleOffset.value, 1, maxinumScale * 1.5);
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

  const reflectionStyles = useAnimatedStyle(() => {
    return {
      height: layout.y.value,
      width: layout.x.value,
    };
  });

  const effectStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {rotate: `${rotateImage.value}rad`},
        {rotateY: `${rotate.y.value}rad`},
        {rotateX: `${rotate.x.value}rad`},
      ],
    };
  });

  const cropImage = async () => {
    const actions = [];

    if (rotate.y.value === Math.PI) {
      actions.push({flip: FlipType.Horizontal});
    }

    if (rotate.x.value === Math.PI) {
      actions.push({flip: FlipType.Vertical});
    }

    if (rotateImage.value !== 0) {
      actions.push({
        rotate: rotateImage.value * (180 / Math.PI),
      });
    }

    const {originX, originY, resize} = crop(
      {width: layout.x.value, height: layout.y.value},
      {width: imageWidth, height: imageHeight},
      {x: translate.x.value, y: translate.y.value},
      scale.value,
      rotateImage.value,
      R,
      CROP_SIZE,
    );

    const {uri} = await manipulateAsync(
      imagePath,
      [
        {resize},
        ...actions,
        {
          crop: {
            originX,
            originY,
            height: CROP_SIZE,
            width: CROP_SIZE,
          },
        },
      ],
      {base64: false, compress: 1, format: SaveFormat.JPEG},
    );

    await impactAsync(ImpactFeedbackStyle.Medium);
    popToEditProfile();
    emitter.emit('np', uri);
  };

  function popToEditProfile() {
    const editProfile = findLastByName('Edit.Profile');
    if (editProfile) {
      Navigation.popTo(editProfile);
    }
  }

  useAnimatedReaction(
    () => rotateImage.value,
    value => {
      scale.value = withTiming(1);
      translate.x.value = withTiming(0);
      translate.y.value = withTiming(0);

      set(offset, 0);
      layout.x.value =
        value % Math.PI === 0 ? original.x.value : original.y.value;
      layout.y.value =
        value % Math.PI === 0 ? original.y.value : original.x.value;
    },
  );

  useEffect(() => {
    const backButtonListener =
      Navigation.events().registerNavigationButtonPressedListener(e => {
        if (e.buttonId === 'RNN.hardwareBackButton') {
          Navigation.pop(componentId);
        }
      });

    return () => backButtonListener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.container, rStyle]}>
        <Animated.Image
          nativeID={`asset-${imagePath}-dest`}
          onLayout={e => {
            layout.x.value = e.nativeEvent.layout.width;
            layout.y.value = e.nativeEvent.layout.height;
            original.x.value = e.nativeEvent.layout.width;
            original.y.value = e.nativeEvent.layout.height;
          }}
          resizeMethod={'scale'}
          resizeMode={'cover'}
          source={{uri: imagePath}}
          style={[imageStyle, effectStyles]}
        />
      </Animated.View>
      <Animated.View
        style={StyleSheet.absoluteFillObject}
        entering={FadeIn.delay(1000).duration(300)}>
        <Canvas style={StyleSheet.absoluteFill}>
          <Path path={path!} color={'rgba(0, 0, 0, 0.45)'} />
        </Canvas>
      </Animated.View>
      <View style={styles.reflection}>
        <GestureDetector gesture={gesture}>
          <Animated.View>
            <Animated.View style={[reflectionStyles, rStyle]} />
          </Animated.View>
        </GestureDetector>
      </View>
      <View style={styles.effectContainer} nativeID={'effects'}>
        <EffectIndicator
          effect={rotateImage}
          icon={'format-rotate-90'}
          action={'rotate'}
        />

        <EffectIndicator
          effect={rotate.x}
          icon={'flip-vertical'}
          action={'flip'}
        />

        <EffectIndicator
          effect={rotate.y}
          icon={'flip-horizontal'}
          action={'flip'}
        />

        <Pressable onPress={cropImage} style={styles.check}>
          <MaterialCommunityIcons name="check" size={30} color={'#fff'} />
        </Pressable>
      </View>
    </View>
  );
};

CropEditor.options = ({uri}) => ({
  hardwareBackButton: {
    popStackOnPress: false,
  },
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
  sideMenu: {
    right: {
      visible: false,
      enabled: false,
    },
  },
  animations: {
    push: {
      sharedElementTransitions: [
        {
          fromId: `asset-${uri}`,
          toId: `asset-${uri}-dest`,
          duration: 150,
        },
      ],
      elementTransitions: [
        {
          id: 'effects',
          alpha: {
            from: 0,
            to: 1,
            duration: 200,
          },
        },
      ],
    },
    pop: {
      sharedElementTransitions: [
        {
          fromId: `asset-${uri}-dest`,
          toId: `asset-${uri}`,
          duration: 150,
        },
      ],
    },
  },
});

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
  effectContainer: {
    width: width * 0.6,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'absolute',
    bottom: width * 0.05,
    right: width * 0.05,
  },
  check: {
    backgroundColor: '#3366ff',
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default CropEditor;
