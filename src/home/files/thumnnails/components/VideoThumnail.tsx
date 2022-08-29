import {Image, Pressable, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {File} from '../../../../utils/types';
import {getThumbnailAsync} from 'expo-video-thumbnails';
import {Navigation} from 'react-native-navigation';
import {Screens} from '../../../../enums/screens';
import {SIZE} from '../utils/constants';

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

  const goToPlayer = () => {
    Navigation.push(parentComponentId, {
      component: {
        name: Screens.VIDEO_PLAYER,
        passProps: {
          thumbnail: poster,
          index,
        },
      },
    });
  };

  useEffect(() => {
    getPoster();
  }, []);

  return (
    <Pressable style={styles.root} onPress={goToPlayer}>
      <Image
        nativeID={`video-${index}`}
        source={{uri: poster}}
        resizeMode={'cover'}
        style={styles.video}
      />
      <Icon name="play-outline" size={50} color={'#fff'} style={styles.icon} />
    </Pressable>
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
