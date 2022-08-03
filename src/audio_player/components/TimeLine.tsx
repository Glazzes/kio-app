import {View, Text, Dimensions, StyleSheet} from 'react-native';
import React, {useState} from 'react';
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
import {clamp} from '../../utils/animations';
import {durationToText} from '../../misc/assets/utils';
import {ReText} from 'react-native-redash';
import Action from './Action';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';

type TimeLineProps = {
  sound: Sound;
  translateX: Animated.SharedValue<number>;
  duration: number;
  isPlaying: boolean;
  setIsPlaying: (value: React.SetStateAction<boolean>) => void;
  loops: 0 | 1 | -1;
  setLoops: (value: React.SetStateAction<0 | 1 | -1>) => void;
};

const {width} = Dimensions.get('window');

const WIDTH = width * 0.9;
const SIZE = 20;
const UPPER_BOUND = width * 0.9 - SIZE;

const TimeLine: React.FC<TimeLineProps> = ({
  sound,
  translateX,
  duration,
  isPlaying,
  setIsPlaying,
  loops,
  setLoops,
}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

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

  const pause = () => {
    cancelAnimation(translateX);
    sound.pause();
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

  return (
    <View>
      <View style={styles.titleContainer}>
        <View style={{maxWidth: width * 0.8}}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode={'tail'}>
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
  );
};

const styles = StyleSheet.create({
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

export default TimeLine;
