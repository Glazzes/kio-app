import {
  View,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React from 'react';
import Sound from 'react-native-sound';
import Animated, {cancelAnimation} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import Action from './Action';
import {
  BlurMask,
  Canvas,
  Circle,
  LinearGradient,
  vec,
} from '@shopify/react-native-skia';

type Loop = 0 | 1 | -1;

type AuidoControlsProps = {
  sound: Sound;
  loaded: boolean;
  isPlaying: boolean;
  setIsPlaying: (value: React.SetStateAction<boolean>) => void;
  loops: Loop;
  setLoops: (value: React.SetStateAction<Loop>) => void;
  translateX: Animated.SharedValue<number>;
  animateTimeLine: () => void;
};

const {width} = Dimensions.get('window');
const WIDTH = width * 0.9;
const BUTTON_SIZE = width * 0.2;

const PADDING = 20;

const AuidoControls: React.FC<AuidoControlsProps> = ({
  sound,
  loaded,
  isPlaying,
  loops,
  setLoops,
  setIsPlaying,
  translateX,
  animateTimeLine,
}) => {
  const play = () => {
    setIsPlaying(p => !p);
    if (sound.isPlaying()) {
      sound.pause();
      cancelAnimation(translateX);
      return;
    }

    sound.play();
    animateTimeLine();
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

  return (
    <View style={styles.controls}>
      <Action icon={'download'} color={'#e3e5eb'} callback={() => {}} />
      <Action icon={'step-backward'} callback={() => {}} />

      <View style={styles.playButton}>
        <Canvas style={styles.canvas}>
          <Circle
            r={BUTTON_SIZE / 2}
            cx={BUTTON_SIZE / 2 + PADDING / 2}
            cy={BUTTON_SIZE / 2 + PADDING / 2}
            blendMode={'multiply'}>
            <LinearGradient
              start={vec(PADDING, PADDING)}
              end={vec(BUTTON_SIZE - PADDING / 2, BUTTON_SIZE - PADDING / 2)}
              colors={loaded ? ['#3366ff', '#ee3060'] : ['magenta', 'cyan']}
            />
            <BlurMask blur={3} style={'solid'} />
          </Circle>
        </Canvas>
        <Pressable onPress={play} style={[styles.playButton]}>
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
      </View>

      <Action icon={'step-forward'} callback={() => {}} />
      <Action
        icon={loops === -1 ? 'repeat-once' : 'repeat'}
        color={loops !== 0 ? '#ee3060' : '#e3e5eb'}
        callback={toggleLoops}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    width: WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playButton: {
    width: BUTTON_SIZE + PADDING,
    height: BUTTON_SIZE + PADDING,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    width: BUTTON_SIZE + PADDING,
    height: BUTTON_SIZE + PADDING,
    position: 'absolute',
    top: 0,
  },
});

export default AuidoControls;
