import {View, StyleSheet} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Video from 'react-native-video';

type VideoPlayerProps = {
  thumbnail: string;
  index: number;
};

const VideoPlayer: NavigationFunctionComponent<VideoPlayerProps> = ({
  thumbnail,
  index,
}) => {
  return (
    <View style={styles.root}>
      <Video
        nativeID={`video-${index}-dest`}
        source={{
          uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        }}
        paused={true}
        controls={true}
        style={[StyleSheet.absoluteFillObject, {backgroundColor: '#000'}]}
        resizeMode={'contain'}
        poster={thumbnail}
        posterResizeMode={'contain'}
      />
    </View>
  );
};

VideoPlayer.options = ({index}) => ({
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
  animations: {
    push: {
      sharedElementTransitions: [
        {
          fromId: `video-${index}`,
          toId: `video-${index}-dest`,
          duration: 300,
        },
      ],
    },
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000 ',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoPlayer;
