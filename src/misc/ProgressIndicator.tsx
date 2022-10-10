import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {
  Canvas,
  Fill,
  LinearGradient,
  Path,
  RoundedRect,
  Shadow,
  Skia,
  useSharedValueEffect,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import Animated, {
  FadeIn,
  Keyframe,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import FS from 'react-native-fs';
import {createAlbumAsync, createAssetAsync} from 'expo-media-library';
import emitter from '../utils/emitter';
import {Event} from '../enums/events';
import notifee from '@notifee/react-native';

type ProgressIndicatorProps = {
  filesToUpload?: string[];
  downloadFileIds?: string[];
};

const {width} = Dimensions.get('window');
const SIZE = 40;

const path = Skia.Path.Make();
path.moveTo(SIZE / 2, SIZE / 2);
path.addArc(
  {
    x: 1.5,
    y: 1.5,
    width: SIZE - 3,
    height: SIZE - 3,
  },
  90,
  360,
);

const ProgressIndicator: NavigationFunctionComponent<
  ProgressIndicatorProps
> = ({filesToUpload, downloadFileIds}) => {
  const [height, setHeight] = useState<number>(1);

  const onLayout = ({
    nativeEvent: {
      layout: {height: h},
    },
  }: LayoutChangeEvent) => {
    emitter.emit(Event.FAB_MOVE_UP, h + 10);
    setHeight(h);
  };

  const sendFabMoveDownEvent = () => {
    emitter.emit(Event.FAB_MOVE_DOWN);
  };

  const upload = () => {
    if (filesToUpload) {
    }
  };

  const downloadFile = async () => {
    const id = await notifee.displayNotification({
      title: 'Downloading 10 files',
      body: '0 out 10 files downloaded',
    });
  };

  const opacity = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(0);

  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{translateY: translateY.value}],
    };
  });

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, {duration: 300}),
      withTiming(1.05, {duration: 4000}),
      withTiming(0, {duration: 300}, finished => {
        if (finished) {
          translateY.value = 300;
          runOnJS(sendFabMoveDownEvent)();
        }
      }),
    );

    downloadFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.root, rStyle]} onLayout={onLayout}>
      <Canvas style={styles.shadowCanvas}>
        <RoundedRect
          x={10}
          y={10}
          width={width * 0.9 + 5}
          height={SIZE + 15}
          r={5}
          color={'#fff'}>
          <Shadow blur={10} dx={10} dy={10} color={'rgba(0, 0, 0, 0.2)'} />
        </RoundedRect>
      </Canvas>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View>
          <Text style={styles.title}>Download in progress</Text>
          <Text style={styles.subtitle}>10 files will be downloaded</Text>
        </View>
      </View>
    </Animated.View>
  );
};

ProgressIndicator.options = {
  overlay: {
    interceptTouchOutside: false,
  },
};

const styles = StyleSheet.create({
  root: {
    width: width * 0.9,
    borderRadius: 5,
    flexDirection: 'row',
    // alignItems: 'center',
    padding: 10,
    position: 'absolute',
    bottom: width * 0.05,
    paddingHorizontal: 10,
    marginHorizontal: width * 0.05,
  },
  shadowCanvas: {
    width: width * 0.9 + 75,
    height: SIZE + 75,
    position: 'absolute',
    transform: [{translateX: -10}, {translateY: -10}],
  },
  progress: {
    width: SIZE,
    height: SIZE,
    marginRight: 10,
  },

  title: {
    fontFamily: 'UberBold',
    color: '#000',
  },
  subtitle: {
    fontFamily: 'UberBold',
    fontSize: 12,
  },
});

export default ProgressIndicator;
