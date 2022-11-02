import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Video from 'react-native-video';
import FileDetailsAppbar from '../misc/FileDetailsAppbar';
import {File} from '../shared/types';
import {host} from '../shared/constants';
import {useSnapshot} from 'valtio';
import authState from '../store/authStore';

type VideoPlayerProps = {
  thumbnail: string;
  file: File;
};

const VideoPlayer: NavigationFunctionComponent<VideoPlayerProps> = ({
  componentId,
  thumbnail,
  file,
}) => {
  const uri = `${host}/static/file/${file.id}`;
  const {accessToken} = useSnapshot(authState.tokens);

  const [ready, setReady] = useState<boolean>(false);

  return (
    <View style={styles.root}>
      <Video
        source={{uri, headers: {Authorization: `Bearer ${accessToken}`}}}
        paused={false}
        controls={true}
        style={[StyleSheet.absoluteFillObject, {backgroundColor: '#000'}]}
        resizeMode={'contain'}
        poster={thumbnail}
        posterResizeMode={'contain'}
        useTextureView={false}
        onReadyForDisplay={() => setReady(true)}
        pictureInPicture={true}
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
