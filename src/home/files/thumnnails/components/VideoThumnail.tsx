import {Image, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {File} from '../../../../utils/types';
import {getThumbnailAsync} from 'expo-video-thumbnails';
import {Navigation} from 'react-native-navigation';
import {Screens} from '../../../../enums/screens';
import {SIZE} from '../utils/constants';
import emitter from '../../../../utils/emitter';

type VideoThumnailProps = {
  file?: File;
  index: number;
  parentComponentId: string;
};

const VideoThumnail: React.FC<VideoThumnailProps> = ({
  index,
  parentComponentId,
}) => {
  const [poster, setPoster] = useState<string>('');

  const getPoster = async () => {
    try {
      const {uri} = await getThumbnailAsync(
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        {
          time: 1000,
          quality: 1,
        },
      );

      setPoster(uri);
    } catch (e) {
      console.warn(e);
    }
  };

  const pushToPlayer = () => {
    Navigation.push(parentComponentId, {
      component: {
        name: Screens.VIDEO_PLAYER,
        passProps: {
          thumbnail: poster,
          index,
          isVideo: true,
        },
      },
    });
  };

  useEffect(() => {
    getPoster();
  }, []);

  useEffect(() => {
    const push = emitter.addListener(`push-${index}`, () => {
      pushToPlayer();
    });

    return () => {
      push.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <View style={styles.root}>
      <Image
        nativeID={`video-${index}`}
        source={{uri: poster}}
        resizeMode={'cover'}
        style={styles.video}
      />
      <Icon name="play" size={50} color={'#fff'} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#f3f3f3',
  },
  video: {
    width: SIZE,
    height: SIZE,
  },
  icon: {
    position: 'absolute',
  },
});

export default React.memo(VideoThumnail);
