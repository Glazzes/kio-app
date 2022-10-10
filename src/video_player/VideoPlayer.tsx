import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Video from 'react-native-video';
import FileDetailsAppbar from '../misc/FileDetailsAppbar';
import {File} from '../shared/types';

type VideoPlayerProps = {
  thumbnail: string;
  file: File;
};

const VideoPlayer: NavigationFunctionComponent<VideoPlayerProps> = ({
  componentId,
  thumbnail,
  file,
}) => {
  const [ready, setReady] = useState<boolean>(false);

  return (
    <View style={styles.root}>
      <Video
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
        file={file}
        parentComponentId={componentId}
        isVideo={ready}
        isModal={false}
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
    backgroundColor: '#000 ',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoPlayer;
