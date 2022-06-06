import {View} from 'react-native';
import React from 'react';
import {File} from '../../../utils/types';
import {Video} from 'expo-av';
import useAuthStore from '../../../store/authStore';

type VideoThumnailProps = {
  file?: File;
};

const VideoThumnail: React.FC<VideoThumnailProps> = ({}) => {
  const accessToken = useAuthStore(s => s.accessToken);

  return (
    <View>
      <Video
        source={{uri: '', headers: {Authorization: accessToken}}}
        resizeMode="cover"
      />
    </View>
  );
};

export default VideoThumnail;
