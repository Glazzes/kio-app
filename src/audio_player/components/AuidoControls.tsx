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
    <View>
      <View style={styles.controls}>
        <Action icon={'download'} color={'#e3e5eb'} callback={() => {}} />
        <Action icon={'step-backward'} callback={() => {}} />
        <Pressable
          onPress={play}
          style={[
            styles.playButton,
            // eslint-disable-next-line react-native/no-inline-styles
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
        <Action icon={'step-forward'} callback={() => {}} />
        <Action
          icon={loops === -1 ? 'repeat-once' : 'repeat'}
          color={loops !== 0 ? '#ee3060' : '#e3e5eb'}
          callback={toggleLoops}
        />
      </View>
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
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuidoControls;
