/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dimensions,
  StyleSheet,
  ImageStyle,
  ImageBackground,
  View,
  Image,
} from 'react-native';
import React, {useMemo} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSnapshot} from 'valtio';
import authState from '../../store/authStore';
import {getSimpleMimeType} from '../../shared/functions/getMimeType';
import {MimeType} from '../../shared/enum/MimeType';
import Audio from './Audio';
import {host} from '../../shared/constants';
import {File} from '../../shared/types';

type DrawerImageThumbnailProps = {
  file: File;
};

const {width} = Dimensions.get('window');
const SIZE = width * 0.75 - 15;

const DrawerImageThumbnail: React.FC<DrawerImageThumbnailProps> = ({file}) => {
  const {accessToken} = useSnapshot(authState.tokens);

  const uri = `${host}/static/file/${file.id}`;

  const imageStyle: ImageStyle = useMemo(() => {
    const fileWidth = file.details.dimensions?.[0] ?? 1;
    const fileHeight = file.details.dimensions?.[1] ?? 1.1;

    const isWider = fileWidth > fileHeight;
    const aspecRatio = fileWidth / fileHeight;
    return {
      width: isWider ? SIZE : SIZE * aspecRatio,
      height: isWider ? SIZE / aspecRatio : SIZE,
      borderRadius: 5,
    };
  }, [file.details.dimensions]);

  const renderThumbnail = () => {
    if (!file) {
      return <View />;
    }

    const contentType = getSimpleMimeType(file.contentType);

    switch (contentType) {
      case MimeType.IMAGE:
        return (
          <Image
            source={{uri, headers: {Authorization: `Bearer ${accessToken}`}}}
            style={[imageStyle, styles.image]}
            resizeMode={'cover'}
          />
        );
      case MimeType.AUDIO:
        return (
          <Audio
            backgroundColor={'#fff'}
            height={SIZE - 20}
            width={SIZE - 20}
            upperWaveHeight={SIZE * 0.75}
            lowerWaveHeight={SIZE * 0.755}
            samples={file.details.audioSamples!! as number[]}
          />
        );
      default:
        return <View />;
    }
  };

  return <View style={styles.preview}>{renderThumbnail()}</View>;
};

const styles = StyleSheet.create({
  preview: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DrawerImageThumbnail;
