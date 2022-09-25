/* eslint-disable react-hooks/exhaustive-deps */
import {View, StyleSheet, Dimensions} from 'react-native';
import React, {useMemo} from 'react';
import {
  BlurMask,
  Canvas,
  LinearGradient,
  Mask,
  Path,
  Rect,
  useSharedValueEffect,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolate,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {createWaveFormPath} from '../utils/functions/createWaveFormPath';
import {convertAudioPointsToBarPoints} from '../utils/functions/convertAudioPointsToBarPoints';
import {
  CANVAS_HEIGHT,
  LOWER_BAR_HEIGHT,
  STROKE_WIDTH,
  UPPER_BAR_HEIGHT,
  WAVEFORMS_MARGIN,
} from '../utils/constants';
import {clamp} from '../../utils/animations';
import {convertCurrentTimeToTextTime} from '../utils/functions/convertCurrentTimeToTextTime';
import {ReText} from 'react-native-redash';
import Sound from 'react-native-sound';

import json from '../assets/waves.json';

type WavesProps = {
  sound: Sound;
  translateX: Animated.SharedValue<number>;
  progress: Animated.SharedValue<number>;
  duration: number;
  isPlaying: boolean;
};

const {width} = Dimensions.get('window');

const Waves: React.FC<WavesProps> = ({
  sound,
  translateX,
  progress,
  duration,
  isPlaying,
}) => {
  const skWidth = useValue(0);
  const offset = useSharedValue<number>(0);

  const audioPoints = useMemo(
    () => convertAudioPointsToBarPoints(json.data),
    [],
  );

  const upperWaveForm = useMemo(() => {
    return createWaveFormPath(audioPoints, 'upper');
  }, []);

  const lowerWaveForm = useMemo(() => {
    return createWaveFormPath(audioPoints, 'lower');
  }, []);

  const durationText = useDerivedValue(() => {
    return convertCurrentTimeToTextTime(duration);
  }, [duration]);

  const elapsedTime = useDerivedValue(() => {
    return convertCurrentTimeToTextTime(Math.floor(progress.value * duration));
  }, [progress, duration]);

  const animateWave = () => {
    translateX.value = withTiming(
      -width / 2,
      {
        duration: (1 - progress.value) * duration * 1000,
        easing: Easing.linear,
      },
      hasFinished => {
        if (hasFinished) {
        }
      },
    );
  };

  const pause = () => {
    sound.pause();
  };

  const pauseWithCancel = () => {
    sound.pause();
    cancelAnimation(translateX);
  };

  const resume = () => {
    sound.setCurrentTime(progress.value * duration);

    if (isPlaying) {
      animateWave();
      sound.play();
    }
  };

  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.value = translateX.value;
      runOnJS(pauseWithCancel)();
    })
    .onChange(e => {
      const tx = e.translationX + offset.value;
      translateX.value = clamp(tx, -width / 2, width / 2);
    })
    .onEnd(() => {
      runOnJS(resume)();
    });

  const tap = Gesture.Tap()
    .numberOfTaps(1)
    .onStart(() => {
      runOnJS(pause)();
    })
    .onEnd(e => {
      const position = interpolate(
        e.x,
        [0, width],
        [width / 2, -width / 2],
        Extrapolate.CLAMP,
      );

      translateX.value = withTiming(
        position,
        {duration: 1000, easing: Easing.linear},
        hasFinished => {
          if (hasFinished) {
            runOnJS(resume)();
          }
        },
      );
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  const lineRStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translateX.value,
        [-width / 2, 0, width / 2],
        ['#3366ff', '#0b4199', '#3366ff'],
        'RGB',
      ),
    };
  });

  useSharedValueEffect(() => {
    skWidth.current = interpolate(
      translateX.value,
      [width / 2, -width / 2],
      [0, width],
      Extrapolate.CLAMP,
    );
  }, translateX);

  return (
    <View style={styles.root}>
      <View>
        <GestureDetector gesture={Gesture.Race(tap, pan)}>
          <Animated.View style={rStyle}>
            <Canvas style={styles.canvas}>
              <Path
                path={upperWaveForm}
                strokeWidth={STROKE_WIDTH}
                style={'stroke'}
                color={'#C5C8D7'}
              />
              <Mask
                mode="luminance"
                mask={
                  <Path
                    path={upperWaveForm}
                    strokeWidth={STROKE_WIDTH}
                    style={'stroke'}
                    color={'#fff'}>
                    <BlurMask blur={1} style={'solid'} />
                  </Path>
                }>
                <Rect x={0} y={0} width={skWidth} height={UPPER_BAR_HEIGHT}>
                  <LinearGradient
                    colors={['#3366ff', '#0b4199', '#3366ff']}
                    start={vec(0, 0)}
                    end={vec(width, UPPER_BAR_HEIGHT)}
                  />
                </Rect>
              </Mask>

              <Path
                path={lowerWaveForm}
                strokeWidth={STROKE_WIDTH}
                style={'stroke'}
                color={'#f3f3f3'}>
                <BlurMask blur={1} style={'solid'} />
              </Path>
              <Mask
                mode="luminance"
                mask={
                  <Path
                    path={lowerWaveForm}
                    strokeWidth={STROKE_WIDTH}
                    style={'stroke'}
                    color={'#fff'}
                  />
                }>
                <Rect
                  x={0}
                  y={UPPER_BAR_HEIGHT + WAVEFORMS_MARGIN}
                  width={skWidth}
                  height={LOWER_BAR_HEIGHT}
                  color={'rgba(51, 102, 205, 0.7)'}
                />
              </Mask>
            </Canvas>
          </Animated.View>
        </GestureDetector>
        <View style={styles.control}>
          <View style={styles.lineContainer}>
            <ReText text={elapsedTime} style={styles.time} />
            <Animated.View style={[lineRStyles, styles.line]} />
            <ReText text={durationText} style={styles.duration} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  canvas: {
    width: width,
    height: CANVAS_HEIGHT,
  },
  control: {
    width,
    height: UPPER_BAR_HEIGHT + 20,
    position: 'absolute',
    top: -20,
    alignItems: 'center',
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  time: {
    fontFamily: 'UberBold',
    color: '#3366ff',
    margin: 0,
    padding: 0,
    flex: 1,
    textAlign: 'right',
  },
  duration: {
    fontFamily: 'UberBold',
    color: '#C5C8D7',
    margin: 0,
    padding: 0,
    flex: 1,
  },
  line: {
    width: 3,
    height: UPPER_BAR_HEIGHT + 20,
    marginHorizontal: 5,
  },
});

export default Waves;
