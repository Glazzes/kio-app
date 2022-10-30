/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dimensions,
  StyleSheet,
  ImageStyle,
  ImageBackground,
  View,
} from 'react-native';
import React, {useMemo} from 'react';
import {Dimension} from '../../shared/types';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSnapshot} from 'valtio';
import authState from '../../store/authStore';
import {navigationState} from '../../store/navigationStore';
import {getSimpleMimeType} from '../../shared/functions/getMimeType';
import {MimeType} from '../../shared/enum/MimeType';
import Audio from './Audio';

type DrawerImageThumbnailProps = {
  dimensions: Dimension;
  uri: string;
};

const {width} = Dimensions.get('window');
const SIZE = width * 0.75 - 15;

const DrawerImageThumbnail: React.FC<DrawerImageThumbnailProps> = ({
  dimensions,
  uri,
}) => {
  const {accessToken} = useSnapshot(authState.tokens);
  const {file} = useSnapshot(navigationState);

  const imageStyle: ImageStyle = useMemo(() => {
    const isWider = dimensions.width > dimensions.height;
    const aspecRatio = dimensions.width / dimensions.height;
    return {
      width: isWider ? SIZE : aspecRatio * SIZE,
      height: isWider ? SIZE / aspecRatio : SIZE,
      borderRadius: 5,
    };
  }, []);

  const renderThumbnail = () => {
    if (!file) {
      return <View />;
    }

    const contentType = getSimpleMimeType(file.contentType);
    switch (contentType) {
      case (MimeType.IMAGE, MimeType.VIDEO, MimeType.PDF):
        return (
          <ImageBackground
            source={{uri, headers: {Authorization: accessToken}}}
            style={[imageStyle, styles.image]}
            resizeMode={'cover'}
            imageStyle={imageStyle}>
            {file?.contentType === 'video' && (
              <Icon name={'play'} size={40} color={'#fff'} />
            )}
          </ImageBackground>
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
