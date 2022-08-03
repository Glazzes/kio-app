/* eslint-disable react-hooks/exhaustive-deps */
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
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
import FastImage from 'react-native-fast-image';
import Action from '../audio_player/components/Action';
import AuidoControls from '../audio_player/components/AuidoControls';
import TimeLine from '../audio_player/components/TimeLine';

Sound.setCategory('Playback');

type AudioPlayerProps = {};

const {statusBarHeight} = Navigation.constantsSync();
const {width} = Dimensions.get('window');

const WIDTH = width * 0.9;
const SIZE = 20;
const ICON_SIZE = 23;
const UPPER_BOUND = width * 0.9 - SIZE;

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

  const animateProgressBar = () => {
    translateX.value = withTiming(
      UPPER_BOUND,
      {
        duration: (1 - progress.value) * duration * 1000,
        easing: Easing.linear,
      },
      hasFinished => {
        if (hasFinished) {
          runOnJS(onAudioEnd)();
        }
      },
    );
  };

  const onEndDrag = () => {
    sound.setCurrentTime(progress.value * duration);
    if (isPlaying) {
      animateProgressBar();
      sound.play(success => {
        if (!success) {
          cancelAnimation(translateX);
        }
      });
    }
  };

  const onAudioEnd = () => {
    translateX.value = 0;
    setIsPlaying(false);

    if (loops !== 0) {
      sound.setCurrentTime(0);
      sound.play();
      animateProgressBar();
      setIsPlaying(true);
      setLoops(l => (l === 1 ? 0 : -1));
    }
  };

  const pause = () => {
    cancelAnimation(translateX);
    sound.pause();
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
    height: 3,
    borderRadius: 1,
    width: progress.value * width * 0.9,
    backgroundColor: '#1c1514',
  }));

  useEffect(() => {
    return () => {
      sound.release();
    };
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.appbar}>
        <Icon name={'chevron-left'} color={'#1c1514'} size={ICON_SIZE} />
        <Text style={styles.title}>Now playing</Text>
        <Icon name={'dots-vertical'} size={ICON_SIZE} />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <FastImage
          style={styles.vynil}
          source={require('./assets/vynil.png')}
        />

        <View>
          <View>
            <View style={styles.titleContainer}>
              <View style={{maxWidth: width * 0.8}}>
                <Text
                  style={styles.title}
                  numberOfLines={2}
                  ellipsizeMode={'tail'}>
                  Barricades - Attack on titan
                </Text>
              </View>
              <Action
                icon={'heart'}
                color={isFavorite ? '#ee3060' : '#EBEBEB'}
                size={27}
                callback={toggleFavorite}
              />
            </View>

            <View style={styles.view}>
              <View style={styles.progressLine}>
                <Animated.View style={progressLineStyles} />
              </View>
              <GestureDetector gesture={pan}>
                <Animated.View style={[styles.ball, ballStyles]} />
              </GestureDetector>
            </View>
            <View style={styles.timeline}>
              <ReText text={currentTime} style={styles.time} />
              <Text style={styles.time}>
                {duration === 0 ? null : durationToText(duration)}
              </Text>
            </View>
          </View>

          <AuidoControls
            sound={sound}
            loaded={loaded}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            loops={loops}
            setLoops={setLoops}
            translateX={translateX}
            animateTimeLine={animateProgressBar}
          />
        </View>
      </View>
    </View>
  );
};

AudioPlayer.options = {
  statusBar: {
    visible: true,
    drawBehind: false,
  },
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: width * 0.05,
  },
  appbar: {
    width: WIDTH,
    height: statusBarHeight * 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vynil: {
    width: width * 0.55,
    maxWidth: 200,
    aspectRatio: 1,
    marginVertical: 10,
  },
  view: {
    width: width * 0.9,
    height: SIZE,
    justifyContent: 'center',
  },
  titleContainer: {
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heartStyles: {
    marginLeft: 10,
  },
  title: {
    fontFamily: 'UberBold',
    fontSize: 17,
    color: '#1c1514',
  },
  time: {
    fontFamily: 'Uber',
    color: '#1c1514',
    margin: 0,
    padding: 0,
  },
  progressLine: {
    height: 3,
    width: width * 0.9,
    borderRadius: 1,
    backgroundColor: '#EBEBEB',
  },
  ball: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: '#1c1514',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  timeline: {
    width: WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
});

export default AudioPlayer;
