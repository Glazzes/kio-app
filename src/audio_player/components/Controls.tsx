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
import Icon from 'react-native-vector-icons/Ionicons';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import Action from './Action';
import {Canvas, Circle, LinearGradient, vec} from '@shopify/react-native-skia';
import {downloadFile} from '../../shared/requests/functions/downloadFile';
import {File} from '../../shared/types';

type AuidoControlsProps = {
  file: File;
  sound: Sound | undefined;
  loaded: boolean;
  isPlaying: boolean;
  setIsPlaying: (value: React.SetStateAction<boolean>) => void;
  loop: boolean;
  setLoop: (value: React.SetStateAction<boolean>) => void;
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
  loop,
  setLoop,
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

  const toggleLoops = () => {
    impactAsync(ImpactFeedbackStyle.Light);
    setLoop(l => !l);
  };

  return (
    <View style={styles.controls}>
      <Action
        icon={'download'}
        color={'#e3e5eb'}
        callback={() => downloadFile(file)}
      />
      <Action icon={'ios-play-back'} callback={() => {}} />

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
              name={isPlaying ? 'ios-pause' : 'ios-play'}
              color={'#fff'}
              size={35}
            />
          ) : (
            <ActivityIndicator size={40} color={'#fff'} />
          )}
        </Pressable>
      </View>

      <Action icon={'ios-play-forward'} callback={() => {}} />
      <Action
        icon={'repeat'}
        color={loop ? '#ee3060' : '#e3e5eb'}
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
