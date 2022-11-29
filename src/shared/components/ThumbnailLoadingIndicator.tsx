import {
  View,
  Dimensions,
  ImageStyle,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useMemo} from 'react';
import {File} from '../types';
import {staticFileThumbnail} from '../requests/contants';
import {useSnapshot} from 'valtio';
import authState from '../../store/authStore';

type ThumbnailLoadingIndicatorProps = {
  file: File;
};

const {width, height} = Dimensions.get('window');

const ThumbnailLoadingIndicator: React.FC<ThumbnailLoadingIndicatorProps> = ({
  file,
}) => {
  const prefx = file.contentType.startsWith('video') ? 'video' : 'pdf';
  const uri = staticFileThumbnail(file.id);
  const {accessToken} = useSnapshot(authState.tokens);

  const imageStyle: ImageStyle = useMemo(() => {
    const w = file.details.dimensions?.[0] ?? width;
    const h = file.details.dimensions?.[1] ?? width;
    const ap = w / h;
    const isWider = w > h;

    return {
      width: isWider ? width : ap * width,
      height: isWider ? width / ap : width,
    };
  }, [file]);

  return (
    <View style={styles.root}>
      <Image
        nativeID={`${prefx}-${file.id}-dest`}
        source={{uri, headers: {Authorization: `Bearer ${accessToken}`}}}
        style={imageStyle}
      />
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size={'large'} color={'#fff'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    height,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
  },
});

export default ThumbnailLoadingIndicator;
