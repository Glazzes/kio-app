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

type DrawerImageThumbnailProps = {
  dimensions: Dimension;
  uri: string;
  contentType: string;
};

const {width} = Dimensions.get('window');
const SIZE = width * 0.75 - 15;

const DrawerImageThumbnail: React.FC<DrawerImageThumbnailProps> = ({
  dimensions,
  uri,
  contentType,
}) => {
  const imageStyle: ImageStyle = useMemo(() => {
    const isWider = dimensions.width > dimensions.height;
    const aspecRatio = dimensions.width / dimensions.height;
    return {
      width: isWider ? SIZE : aspecRatio * SIZE,
      height: isWider ? SIZE / aspecRatio : SIZE,
      borderRadius: 5,
    };
  }, []);

  return (
    <View style={styles.preview}>
      <ImageBackground
        source={{uri}}
        style={[imageStyle, styles.image]}
        resizeMode={'cover'}
        imageStyle={imageStyle}>
        {contentType === 'video' && (
          <Icon name={'play'} size={40} color={'#fff'} />
        )}
      </ImageBackground>
    </View>
  );
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
