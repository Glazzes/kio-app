import {Dimensions, StyleSheet, ViewStyle} from 'react-native';
import React, {useEffect} from 'react';
import {
  Navigation,
  NavigationComponentListener,
  NavigationFunctionComponent,
  OptionsModalPresentationStyle,
} from 'react-native-navigation';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import {snapPoint, useVector} from 'react-native-redash';
import {clamp, imageStyles, pinch, set} from '../../../utils/animations';
import {Dimension, File} from '../../../shared/types';
import {getMaxImageScale} from '../../../crop_editor/utils/functions/getMaxImageScale';
import emitter, {
  dismissLastModalEventName,
  emitHideAppbar,
} from '../../../shared/emitter';
import FileDetailsAppbar from '../../../shared/components/FileDetailsAppbar';
import {useSnapshot} from 'valtio';
import authState from '../../../store/authStore';

type ImageDetailsProps = {
  file: File;
  uri: string;
  opacity: Animated.SharedValue<number>;
  dimensions: Dimension;
};

const {width, height} = Dimensions.get('window');

const ImageDetails: NavigationFunctionComponent<ImageDetailsProps> = ({
  componentId,
  uri,
  opacity,
  dimensions,
  file,
}) => {
  const {accessToken} = useSnapshot(authState.tokens);

  const imageS: ViewStyle = imageStyles(dimensions);

  const lightenBackground = useSharedValue<boolean>(false);
  const hideOnDrag = useSharedValue<boolean>(true);

  const layout = useVector(1, 1);
  const translate = useVector(0, 0);
  const offset = useVector(0, 0);

  const scale = useSharedValue<number>(1);
  const scaleOffset = useSharedValue<number>(1);

  const origin = useVector(0, 0);
  const canAssignOrigin = useSharedValue<boolean>(true);

  const translation = useDerivedValue<{x: number; y: number}>(() => {
    const offsetX = Math.max((layout.x.value * scale.value - width) / 2, 0);
    const offsetY = Math.max((layout.y.value * scale.value - height) / 2, 0);

    const x = clamp(translate.x.value, -offsetX, offsetX);
    const y = clamp(translate.y.value, -offsetY, offsetY);

    return {x, y};
  }, [translate.x.value, translate.y.value, scale.value]);

  const backgroundColor = useDerivedValue(() => {
    if (lightenBackground.value) {
      return withTiming('transparent', {duration: 150});
    }

    return scale.value === 1
      ? interpolateColor(
          translate.y.value,
          [-height / 2, 0, height / 2],
          ['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.2)'],
          'RGB',
        )
      : 'rgba(0, 0, 0, 1)';
  }, [translate.y, lightenBackground]);

  const dismissModal = () => {
    Navigation.dismissModal(componentId);
    setTimeout(() => (opacity.value = 1), 15);
  };

  const sendHideAppbarEvent = () => {
    emitHideAppbar();
  };

  const pan = Gesture.Pan()
    .maxPointers(1)
    .onStart(_ => {
      if (scale.value === 1 && hideOnDrag.value) {
        runOnJS(sendHideAppbarEvent)();
        hideOnDrag.value = false;
      }

      offset.x.value = translation.value.x;
      offset.y.value = translation.value.y;
    })
    .onChange(e => {
      translate.x.value = offset.x.value + e.translationX;
      translate.y.value = offset.y.value + e.translationY;
    })
    .onEnd(({velocityX, velocityY}) => {
      const snap = snapPoint(translate.y.value, velocityY, [
        -height,
        0,
        height,
      ]);

      if (scale.value === 1) {
        if (snap === -height || snap === height) {
          runOnJS(dismissModal)();
        }

        if (snap === 0) {
          translate.y.value = withTiming(0);
          offset.y.value = withTiming(0);
        }

        return;
      }

      translate.x.value = withDecay({velocity: velocityX, deceleration: 0.95});
      translate.y.value = withDecay({velocity: velocityY, deceleration: 0.95});
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      offset.x.value = translation.value.x;
      offset.y.value = translation.value.y;
      scaleOffset.value = scale.value;
    })
    .onChange(e => {
      const {translateX, translateY} = pinch({
        center: {x: layout.x.value / 2, y: layout.y.value / 2},
        offset: {x: offset.x.value, y: offset.y.value},
        event: e,
        origin,
        canAssignOrigin: canAssignOrigin,
      });

      translate.x.value = offset.x.value + translateX;
      translate.y.value = offset.y.value + translateY;
      scale.value = scaleOffset.value * e.scale;
    })
    .onEnd(_ => {
      canAssignOrigin.value = true;
      if (scale.value < 1) {
        scale.value = withTiming(1);
        set(translate, 0);
        set(offset, 0);
      }
    });

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onStart(() => {
      runOnJS(sendHideAppbarEvent)();
      hideOnDrag.value = !hideOnDrag.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(e => {
      const toMaxScale = getMaxImageScale(
        {width: layout.x.value, height: layout.y.value},
        {...dimensions},
        0,
      );

      let toScale = scale.value * 2;
      if (toScale > toMaxScale) {
        toScale = 1;
      }

      const {translateX, translateY} = pinch({
        center: {x: layout.x.value / 2, y: layout.y.value / 2},
        offset: {x: offset.x.value, y: offset.y.value},
        event: {focalX: e.x, focalY: e.y, scale: toScale},
        origin,
        canAssignOrigin: canAssignOrigin,
      });

      if (toScale === 1) {
        translate.y.value = withTiming(0);
      } else {
        translate.y.value = withTiming(offset.y.value + translateY);
      }
      translate.x.value = withTiming(offset.x.value + translateX);
      scale.value = withTiming(toScale);
    })
    .onFinalize(() => {
      canAssignOrigin.value = true;
    });

  const combinedGesture = Gesture.Exclusive(
    pan,
    pinchGesture,
    doubleTap,
    singleTap,
  );

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translation.value.x},
        {
          translateY:
            scale.value === 1 ? translate.y.value : translation.value.y,
        },
        {scale: scale.value},
      ],
    };
  });

  const rootRStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    };
  });

  useEffect(() => {
    const componentListener: NavigationComponentListener = {
      navigationButtonPressed: ({buttonId}) => {
        if (buttonId === 'RNN.hardwareBackButton') {
          lightenBackground.value = true;
          dismissModal();
        }
      },
    };

    const backListener = Navigation.events().registerComponentListener(
      componentListener,
      componentId,
    );

    const dissmiss = emitter.addListener(dismissLastModalEventName, () => {
      dismissModal();
    });

    return () => {
      backListener.remove();
      dissmiss.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.root, rootRStyles]}>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={imageS}>
          <Animated.Image
            onLayout={({nativeEvent}) => {
              layout.x.value = nativeEvent.layout.width;
              layout.y.value = nativeEvent.layout.height;
            }}
            nativeID={`img-${file.id}-dest`}
            source={{uri, headers: {Authorization: `Bearer ${accessToken}`}}}
            resizeMethod={'scale'}
            resizeMode={'cover'}
            style={[imageS as any, rStyle]}
          />
        </Animated.View>
      </GestureDetector>
      <FileDetailsAppbar
        file={file}
        parentComponentId={componentId}
        isModal={true}
      />
    </Animated.View>
  );
};

ImageDetails.options = ({file}) => ({
  statusBar: {
    visible: true,
    drawBehind: true,
  },
  sideMenu: {
    right: {
      enabled: true,
    },
  },
  modalPresentationStyle: OptionsModalPresentationStyle.overCurrentContext,
  layout: {
    backgroundColor: 'transparent',
  },
  hardwareBackButton: {
    dismissModalOnPress: false,
  },
  animations: {
    showModal: {
      sharedElementTransitions: [
        {
          fromId: `img-${file.id}`,
          toId: `img-${file.id}-dest`,
          duration: 300,
        },
      ],
    },
    dismissModal: {
      sharedElementTransitions: [
        {
          fromId: `img-${file.id}-dest`,
          toId: `img-${file.id}`,
          duration: 300,
        },
      ],
    },
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageDetails;
