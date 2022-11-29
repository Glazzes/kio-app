import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Video from 'react-native-video';
import FileDetailsAppbar from '../shared/components/FileDetailsAppbar';
import {File} from '../shared/types';
import {useSnapshot} from 'valtio';
import authState from '../store/authStore';
import {staticFileUrl} from '../shared/requests/contants';
import {displayToast, videoLoadErrorMessage} from '../shared/toast';
import ThumbnailLoadingIndicator from '../shared/components/ThumbnailLoadingIndicator';

type VideoPlayerProps = {
  file: File;
  thumbnailUri: string;
};

const VideoPlayer: NavigationFunctionComponent<VideoPlayerProps> = ({
  componentId,
  file,
  thumbnailUri,
}) => {
  const uri = staticFileUrl(file.id);
  const {accessToken} = useSnapshot(authState.tokens);

  const [ready, setReady] = useState<boolean>(false);

  const onError = () => {
    displayToast(videoLoadErrorMessage);
  };

  return (
    <View style={styles.root}>
      <Video
        source={{uri, headers: {Authorization: `Bearer ${accessToken}`}}}
        paused={false}
        controls={true}
        style={[StyleSheet.absoluteFillObject, styles.black]}
        poster={thumbnailUri}
        resizeMode={'contain'}
        onReadyForDisplay={() => setReady(true)}
        onError={onError}
      />
      {!ready && <ThumbnailLoadingIndicator file={file} />}
      <FileDetailsAppbar
        file={file}
        parentComponentId={componentId}
        isModal={false}
        isVideoReadyForDisplay={ready}
      />
    </View>
  );
};

VideoPlayer.options = ({file}) => ({
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
          fromId: `video-${file.id}`,
          toId: `video-${file.id}-dest`,
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
  black: {
    backgroundColor: '#000',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoPlayer;
