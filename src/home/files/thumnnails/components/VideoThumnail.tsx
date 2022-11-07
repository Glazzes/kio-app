import {Image, StyleSheet, View} from 'react-native';
import React, {useContext, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Navigation} from 'react-native-navigation';
import {Screens} from '../../../../enums/screens';
import {SIZE} from '../utils/constants';
import emitter from '../../../../utils/emitter';
import {NavigationContext} from '../../../../navigation/NavigationContextProvider';
import {File} from '../../../../shared/types';
import {host} from '../../../../shared/constants';
import {useSnapshot} from 'valtio';
import authState from '../../../../store/authStore';

type VideoThumnailProps = {
  file: File;
  index: number;
};

const VideoThumnail: React.FC<VideoThumnailProps> = ({index, file}) => {
  const {accessToken} = useSnapshot(authState.tokens);
  const thumbnailUri = `${host}/static/file/${file.id}/thumbnail`;
  const {componentId} = useContext(NavigationContext);

  const pushToPlayer = () => {
    Navigation.push(componentId, {
      component: {
        name: Screens.VIDEO_PLAYER,
        passProps: {
          thumbnail: thumbnailUri,
          index,
          isVideo: true,
          file,
        },
      },
    });
  };

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
        source={{
          uri: thumbnailUri,
          headers: {Authorization: `Bearer ${accessToken}`},
        }}
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
