/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  Pressable,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Sound from 'react-native-sound';
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {clamp} from '../utils/animations';
import {durationToText} from './assets/utils';
import {ReText} from 'react-native-redash';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';

Sound.setCategory('Playback');

type AudioPlayerProps = {};

const {width} = Dimensions.get('window');

const WIDTH = width * 0.9;
const SIZE = 21;
const UPPER_BOUND = width * 0.9 - SIZE;
const BUTTON_SIZE = width * 0.2;

const AudioPlayer: NavigationFunctionComponent<AudioPlayerProps> = ({}) => {
  const [duration, setDuration] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loops, setLoops] = useState<0 | 1 | -1>(0);

  const translateX = useSharedValue<number>(0);
  const offset = useSharedValue<number>(0);

  const progress = useDerivedValue(() => {
    return interpolate(
      translateX.value,
      [0, UPPER_BOUND],
      [0, 1],
      Extrapolate.CLAMP,
    );
  }, [translateX]);

  const currentTime = useDerivedValue(() => {
    return durationToText(Math.floor(progress.value * duration));
  }, [duration, progress]);

  const sound = useMemo(() => {
    return new Sound(require('./assets/Barricades.mp3'), e => {
      if (e) {
        console.log(e);
      }

      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      setDuration(Math.floor(sound.getDuration()));
      sound.setNumberOfLoops(0);
    }
  }, [loaded, sound]);

  const toggleFavorite = async () => {
    setIsFavorite(f => !f);
    await impactAsync(ImpactFeedbackStyle.Light);
  };

  const toggleLoops = async () => {
    await impactAsync(ImpactFeedbackStyle.Light);
    setLoops(l => {
      if (l === 0) {
        return 1;
      }

      if (l === 1) {
        return -1;
      }

      return 0;
    });
  };

  const animateProgressBar = () => {
    translateX.value = withTiming(
      UPPER_BOUND,
      {
        duration: (1 - progress.value) * duration * 1000,
        easing: Easing.linear,
      },
      hasFinished => {
        if (hasFinished) {
          runOnJS(restart)();
        }
      },
    );
  };

  const play = () => {
    if (translateX.value === UPPER_BOUND) {
      restart();
      setIsPlaying(true);
      return;
    }

    setIsPlaying(p => !p);
    if (sound.isPlaying()) {
      sound.pause();
      cancelAnimation(translateX);
      return;
    }

    sound.play();
    animateProgressBar();
  };

  const pause = () => {
    sound.pause();
    cancelAnimation(translateX);
  };

  const onEndDrag = () => {
    sound.setCurrentTime(progress.value * duration);
    if (isPlaying) {
      sound.play(playing => {
        if (playing) {
          animateProgressBar();
        }
      });
    }
  };

  const restart = () => {
    sound.setCurrentTime(0);
    translateX.value = 0;

    if (loops === 0) {
      console.log('stop!!');
      setIsPlaying(false);
      sound.stop();
    }
  };

  const pan = Gesture.Pan()
    .hitSlop({horizontal: 30, vertical: 30})
    .onStart(_ => {
      runOnJS(pause)();
      offset.value = translateX.value;
    })
    .onChange(e => {
      translateX.value = clamp(offset.value + e.translationX, 0, UPPER_BOUND);
    })
    .onEnd(_ => {
      runOnJS(onEndDrag)();
    });

  const ballStyles = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  const progressLineStyles = useAnimatedStyle(() => ({
    height: 4,
    borderRadius: 1,
    width: progress.value * width * 0.9,
    backgroundColor: '#3366ff',
  }));

  useEffect(() => {
    return () => {
      sound.release();
    };
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.titleContainer}>
        <View>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
            Barricades - Attack on titan
          </Text>
        </View>
        <Pressable onPress={toggleFavorite} hitSlop={20}>
          <Icon
            name={'heart'}
            color={isFavorite ? '#ee3060' : '#F3F3F4'}
            size={27}
          />
        </Pressable>
      </View>

      <View>
        <View style={styles.view}>
          <View style={styles.progressLine}>
            <Animated.View style={progressLineStyles} />
          </View>
          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.ball, ballStyles]}>
              <View style={styles.innerBall} />
            </Animated.View>
          </GestureDetector>
        </View>
        <View style={styles.timeline}>
          <ReText text={currentTime} style={styles.time} />
          <Text style={styles.time}>
            {duration === 0 ? null : durationToText(duration)}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Icon name={'download'} color={'#000'} size={25} />
        <Icon name={'rewind-10'} color={'#000'} size={25} />
        <Pressable
          onPress={play}
          style={[
            styles.playButton,
            {backgroundColor: loaded ? '#3366ff' : '#F3F3F4'},
          ]}>
          {loaded ? (
            <Icon
              name={isPlaying ? 'pause' : 'play'}
              color={'#fff'}
              size={40}
            />
          ) : (
            <ActivityIndicator size={40} color={'#C5C8D7'} />
          )}
        </Pressable>
        <Icon name={'fast-forward-10'} color={'#000'} size={25} />
        <Pressable hitSlop={20} onPress={toggleLoops}>
          <Icon
            name={loops === -1 ? 'repeat-once' : 'repeat'}
            color={loops !== 0 ? '#ee3060' : '#000'}
            size={28}
          />
        </Pressable>
      </View>
    </View>
  );
};

AudioPlayer.options = {
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
  view: {
    width: width * 0.9,
    height: SIZE,
    marginTop: 30,
    justifyContent: 'center',
  },
  titleContainer: {
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'UberBold',
    fontSize: 18,
    color: '#000',
  },
  time: {
    fontFamily: 'UberBold',
    color: '#C5C8D7',
    padding: 0,
    margin: 0,
  },
  progressLine: {
    height: 4,
    width: width * 0.9,
    borderRadius: 1,
    backgroundColor: '#F3F3F4',
  },
  ball: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: '#3366ff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  innerBall: {
    width: SIZE / 2,
    height: SIZE / 2,
    borderRadius: SIZE / 4,
    backgroundColor: '#fff',
  },
  timeline: {
    width: WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  controls: {
    width: WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AudioPlayer;
