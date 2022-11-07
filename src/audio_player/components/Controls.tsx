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
import {Canvas, Circle, LinearGradient, vec} from '@shopify/react-native-skia';
import {downloadFile} from '../../shared/requests/functions/downloadFile';
import {File} from '../../shared/types';

type Loop = 0 | 1 | -1;

type AuidoControlsProps = {
  file: File;
  sound: Sound | undefined;
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
  file,
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
    if (sound?.isPlaying()) {
      sound.pause();
      cancelAnimation(translateX);
      return;
    }

    sound?.play();
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
      <Action
        icon={'download'}
        color={'#e3e5eb'}
        callback={() => downloadFile(file)}
      />
      <Action icon={'step-backward'} callback={() => {}} />

      <View style={styles.playButton}>
        <Canvas style={styles.canvas}>
          <Circle
            r={BUTTON_SIZE / 2}
            cx={BUTTON_SIZE / 2 + PADDING / 2}
            cy={BUTTON_SIZE / 2 + PADDING / 2}
            color={'#3366ff'}>
            <LinearGradient
              colors={['#0b4199', '#3366ff']}
              start={vec(0, 0)}
              end={vec(BUTTON_SIZE + PADDING, BUTTON_SIZE)}
            />
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
