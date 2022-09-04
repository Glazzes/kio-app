import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Video from 'react-native-video';
import FileDetailsAppbar from '../misc/FileDetailsAppbar';

type VideoPlayerProps = {
  thumbnail: string;
  index: number;
};

const VideoPlayer: NavigationFunctionComponent<VideoPlayerProps> = ({
  componentId,
  thumbnail,
  index,
}) => {
  const [ready, setReady] = useState<boolean>(false);

  return (
    <View style={styles.root}>
      <Video
        nativeID={`video-${index}-dest`}
        source={require('./assets/gru.mp4')}
        paused={false}
        controls={true}
        style={[StyleSheet.absoluteFillObject, {backgroundColor: '#000'}]}
        resizeMode={'contain'}
        poster={thumbnail}
        posterResizeMode={'contain'}
        useTextureView={false}
        onReadyForDisplay={() => setReady(true)}
      />
      <FileDetailsAppbar
        parentComponentId={componentId}
        isVideo={ready}
        isModal={false}
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
