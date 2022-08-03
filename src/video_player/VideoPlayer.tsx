import {View, StyleSheet} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Video from 'react-native-video';

type VideoPlayerProps = {};

const VideoPlayer: NavigationFunctionComponent<VideoPlayerProps> = ({}) => {
  return (
    <View style={styles.root}>
      <Video
        nativeID="video"
        source={{
          uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        }}
        paused={true}
        controls={true}
        style={StyleSheet.absoluteFillObject}
        resizeMode={'contain'}
        posterResizeMode={'cover'}
      />
    </View>
  );
};

VideoPlayer.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoPlayer;
