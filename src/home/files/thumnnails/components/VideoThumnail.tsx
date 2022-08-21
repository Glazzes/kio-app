import {Dimensions, Image, Pressable, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {File} from '../../../../utils/types';
import {getThumbnailAsync} from 'expo-video-thumbnails';
import {Navigation} from 'react-native-navigation';
import {Screens} from '../../../../enums/screens';
import Video from 'react-native-video';

type VideoThumnailProps = {
  file?: File;
  index: number;
  parentComponentId: string;
};

const {width} = Dimensions.get('window');
const SIZE = (width * 0.9 - 10) / 2;

const VideoThumnail: React.FC<VideoThumnailProps> = ({
  index,
  parentComponentId,
}) => {
  const [poster, setPoster] = useState<string>('');

  const getPoster = async () => {
    try {
      const {uri} = await getThumbnailAsync(
        'content://com.android.providers.media.documents/document/video%3A649',
        {
          time: 3000,
          quality: 0,
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
        resizeMode={'contain'}
        style={styles.video}
      />
      <Video
        source={{
          uri: 'content://com.android.providers.media.documents/document/video%3A649',
        }}
      />
      <Icon name="play" size={40} color={'#fff'} style={styles.icon} />
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
    backgroundColor: '#000',
  },
  icon: {
    position: 'absolute',
  },
});

export default React.memo(VideoThumnail);
