/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import Icon from 'react-native-vector-icons/Ionicons';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import AuidoControls from './Controls';
import Waves from './Waves';
import {File} from '../../shared/types';
import RNFS from 'react-native-fs';
import {useSnapshot} from 'valtio';
import authState from '../../store/authStore';
import {staticFileUrl} from '../../shared/requests/contants';

Sound.setCategory('Playback');

type AudioPlayerProps = {
  file: File;
};

const {statusBarHeight} = Navigation.constantsSync();
const {width} = Dimensions.get('window');

const WIDTH = width * 0.9;
const ICON_SIZE = 20;

const AudioPlayer: NavigationFunctionComponent<AudioPlayerProps> = ({
  componentId,
  file,
}) => {
  const {accessToken} = useSnapshot(authState.tokens);

  const [sound, setSound] = useState<Sound>();
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
    if (sound) {
      translateX.value = width / 2;
      setIsPlaying(false);
      sound.stop();

      if (loops !== 0) {
        sound.play();
        animateProgressBar();
        setIsPlaying(true);
        setLoops(l => (l === 1 ? 0 : -1));
      }
    }
  };

  const goBack = () => {
    Navigation.pop(componentId);
  };

  useEffect(() => {
    const resource = staticFileUrl(file.id);
    const toFile =
      (Platform.OS === 'android' ? 'file://' : '') +
      RNFS.CachesDirectoryPath +
      `/${file.id}-${file.name}`;

    RNFS.downloadFile({
      fromUrl: resource,
      toFile,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .promise.then(_ => {
        const downloadedSound = new Sound(toFile, undefined, e => {
          if (e) {
            console.log(e);
          }

          setLoaded(true);
          setSound(downloadedSound);
        });
      })
      .catch(e => console.log('Error', e));

    return () => {
      RNFS.unlink(toFile).then(() => console.log('music cache deleted'));
    };
  }, []);

  useEffect(() => {
    if (loaded && sound) {
      sound.setNumberOfLoops(0);
      setDuration(Math.floor(sound.getDuration()));
    }
  }, [loaded, sound]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.stop();
        sound.release();
      }
    };
  }, [sound]);

  return (
    <View style={styles.root}>
      <View style={styles.appbar}>
        <Pressable onPress={goBack}>
          <Icon name={'ios-arrow-back'} color={'#000'} size={ICON_SIZE} />
        </Pressable>

        <View style={styles.row}>
          <Pressable onPress={toggleFavorite}>
            <Icon
              name={isFavorite ? 'ios-heart' : 'ios-heart-outline'}
              size={ICON_SIZE + 3}
              color={isFavorite ? '#ee3060' : '#000'}
              style={styles.icon}
            />
          </Pressable>
          <Icon name={'ellipsis-vertical'} size={ICON_SIZE} color={'#000'} />
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.audioName} numberOfLines={2} ellipsizeMode={'tail'}>
          {file.name}
        </Text>
        <Text style={styles.artist}>Unkwon artist</Text>
      </View>

      <View style={styles.wavesContainer}>
        <Waves
          sound={sound}
          samples={file.details.audioSamples!!}
          translateX={translateX}
          progress={progress}
          duration={duration}
          isPlaying={isPlaying}
        />

        <AuidoControls
          file={file}
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
    backgroundColor: '#fff',
    style: 'dark',
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
  row: {
    flexDirection: 'row',
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
    justifyContent: 'center',
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
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },
  artist: {
    fontFamily: 'UberBold',
    color: '#C5C8D7',
  },
  icon: {
    marginRight: 10,
  },
});

export default AudioPlayer;
