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
import {File, Folder} from '../../shared/types';
import RNFS from 'react-native-fs';
import {useSnapshot} from 'valtio';
import authState from '../../store/authStore';
import {staticFileUrl} from '../../shared/requests/contants';
import {audioLoadErrorMessage, displayToast} from '../../shared/toast';
import {shareFile} from '../../overlays/utils/share';
import {Modals} from '../../navigation/screens/modals';
import {emitFavoriteFile} from '../../shared/emitter';
import {favoriteResource} from '../../shared/requests/functions/favoriteResource';
import {
  pushNavigationScreen,
  removeNavigationScreenByComponentId,
} from '../../store/navigationStore';
import {Screens} from '../../enums/screens';

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
  const [isFavorite, setIsFavorite] = useState<boolean>(file.isFavorite);
  const [loop, setLoop] = useState<boolean>(false);

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
    emitFavoriteFile(file.id);
    setIsFavorite(f => !f);
    await impactAsync(ImpactFeedbackStyle.Light);
  };

  const share = async () => {
    setIsPlaying(false);
    sound?.pause();
    await shareFile(file);
    sound?.play();
    setIsPlaying(true);
  };

  const openFileOptions = () => {
    Navigation.showModal({
      component: {
        name: Modals.FILE_MENU,
        passProps: {
          file,
        },
      },
    });
  };

  const animateTimeLine = () => {
    translateX.value = withTiming(
      -width / 2,
      {
        duration: Math.floor((1 - progress.value) * duration) * 1000,
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

      setLoop(l => {
        if (l) {
          sound.play();
          animateTimeLine();
          setIsPlaying(true);
          return l;
        }

        return false;
      });
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
            displayToast(audioLoadErrorMessage);
            return;
          }

          setLoaded(true);
          setSound(downloadedSound);
        });
      })
      .catch(_ => displayToast(audioLoadErrorMessage));

    return () => {
      RNFS.unlink(toFile).catch(_ => {});
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

  useEffect(() => {
    pushNavigationScreen({
      componentId: Screens.AUDIO_PLAYER,
      folder: {id: '2', name: 'Audio'} as Folder,
    });

    Navigation.updateProps(Screens.FILE_DRAWER, {file});

    return () => {
      removeNavigationScreenByComponentId(Screens.AUDIO_PLAYER);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (isFavorite !== file.isFavorite) {
        favoriteResource(file, isFavorite).catch(() => {});
        emitFavoriteFile(file.id);
      }
    };
  }, [isFavorite]);

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
          <Pressable onPress={share}>
            <Icon
              name={'ios-share-social'}
              size={ICON_SIZE}
              color={'#000'}
              style={styles.icon}
            />
          </Pressable>
          <Pressable onPress={openFileOptions}>
            <Icon name={'ellipsis-vertical'} size={ICON_SIZE} color={'#000'} />
          </Pressable>
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
          animateTimeLine={animateTimeLine}
        />

        <AuidoControls
          file={file}
          sound={sound}
          loaded={loaded}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          loop={loop}
          setLoop={setLoop}
          translateX={translateX}
          animateTimeLine={animateTimeLine}
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
    width: width,
    paddingHorizontal: width * 0.05,
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
    marginRight: width * 0.05,
  },
});

export default AudioPlayer;
