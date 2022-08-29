/* eslint-disable react-hooks/exhaustive-deps */
import {View, StyleSheet, Dimensions, Text, Pressable} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Sound from 'react-native-sound';
import {
  Easing,
  Extrapolate,
  interpolate,
  runOnJS,
  useSharedValue,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import AuidoControls from './Controls';
import Waves from './Waves';

Sound.setCategory('Playback');

type AudioPlayerProps = {};

const {statusBarHeight} = Navigation.constantsSync();
const {width} = Dimensions.get('window');

const WIDTH = width * 0.9;
const ICON_SIZE = 23;

const AudioPlayer: NavigationFunctionComponent<AudioPlayerProps> = ({
  componentId,
}) => {
  const [duration, setDuration] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loops, setLoops] = useState<0 | 1 | -1>(0);

  const translateX = useSharedValue<number>(width / 2);

  const progress = useDerivedValue(() => {
    return interpolate(
      translateX.value,
      [-width / 2, width / 2],
      [1, 0],
      Extrapolate.CLAMP,
    );
  }, [translateX]);

  const sound = useMemo(() => {
    return new Sound(require('../assets/Call.mp3'), e => {
      if (e) {
        console.log(e);
      }

      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      sound.setNumberOfLoops(0);
      setDuration(Math.floor(sound.getDuration()));
    }
  }, [loaded, sound]);

  const toggleFavorite = async () => {
    setIsFavorite(f => !f);
    await impactAsync(ImpactFeedbackStyle.Light);
  };

  const animateProgressBar = () => {
    translateX.value = withTiming(
      -width / 2,
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

  const onAudioEnd = () => {
    translateX.value = width / 2;
    setIsPlaying(false);
    sound.stop();

    if (loops !== 0) {
      sound.play();
      animateProgressBar();
      setIsPlaying(true);
      setLoops(l => (l === 1 ? 0 : -1));
    }
  };

  const goBack = () => {
    Navigation.pop(componentId);
  };

  useEffect(() => {
    return () => {
      sound.release();
    };
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.appbar}>
        <Pressable onPress={goBack}>
          <Icon name={'chevron-left'} color={'#000'} size={ICON_SIZE} />
        </Pressable>

        {/*<Text style={styles.title}>Now playing</Text> */}
        <Icon name={'dots-vertical'} size={ICON_SIZE} color={'#000'} />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.audioName} numberOfLines={2} ellipsizeMode={'tail'}>
          Attack on titan - Call your name
        </Text>
        <Pressable onPress={toggleFavorite}>
          <Icon
            name={'heart'}
            color={isFavorite ? '#ee3060' : '#C5C8D7'}
            size={30}
          />
        </Pressable>
      </View>

      <View style={styles.wavesContainer}>
        <Waves
          sound={sound}
          translateX={translateX}
          progress={progress}
          duration={duration}
          isPlaying={isPlaying}
        />

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
  overlay: {
    interceptTouchOutside: false,
  },
  sideMenu: {
    left: {
      enabled: false,
    },
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
  wavesContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  titleContainer: {
    width: WIDTH,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'UberBold',
    fontSize: 17,
    color: '#1c1514',
  },
  audioName: {
    maxWidth: width * 0.5,
    fontFamily: 'UberBold',
    fontSize: 16,
    color: '#1c1514',
  },
});

export default AudioPlayer;
