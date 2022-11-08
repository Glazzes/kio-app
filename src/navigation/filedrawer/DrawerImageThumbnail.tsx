import {
  Dimensions,
  StyleSheet,
  ImageStyle,
  ImageBackground,
  View,
} from 'react-native';
import React, {useMemo} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSnapshot} from 'valtio';
import authState from '../../store/authStore';
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

  const uri =
    `${host}/static/file/${file.id}` +
    (file.contentType.startsWith('video') || file.contentType.endsWith('pdf')
      ? '/thumbnail'
      : '');

  const imageStyle: ImageStyle = useMemo(() => {
    const fileWidth = file.details.dimensions?.[0] ?? 1;
    const fileHeight = file.details.dimensions?.[1] ?? 1.1;

    const isWider = fileWidth > fileHeight;
    const aspecRatio = fileWidth / fileHeight;
    return {
      width: isWider ? SIZE : SIZE * aspecRatio,
      height: isWider ? SIZE / aspecRatio : SIZE,
    };
  }, [file.details.dimensions]);

  const renderThumbnail = () => {
    // switches with ts enums do not work properly, hail to the if statements
    if (
      file.contentType.startsWith('image') ||
      file.contentType.endsWith('pdf') ||
      file.contentType.startsWith('video')
    ) {
      return (
        <ImageBackground
          source={{uri, headers: {Authorization: `Bearer ${accessToken}`}}}
          style={[imageStyle, styles.image]}
          imageStyle={styles.image}
          resizeMode={'cover'}>
          {file.contentType.startsWith('video') && (
            <Icon name="play" size={50} color={'#fff'} />
          )}
        </ImageBackground>
      );
    }

    if (file.contentType.startsWith('audio')) {
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
    }

    return (
      <View style={styles.preview}>
        <Icon name={'ios-document'} color={'#3366ff'} size={100} />
      </View>
    );
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
    borderRadius: 5,
  },
});

export default DrawerImageThumbnail;
