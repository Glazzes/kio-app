import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  ImageStyle,
  ActivityIndicator,
} from 'react-native';
import React, {useMemo} from 'react';
import {File} from '../../../shared/types';
import {staticFileThumbnail} from '../../../shared/requests/contants';
import {useSnapshot} from 'valtio';
import authState from '../../../store/authStore';

type PdfProgressIndicatorProps = {
  file: File;
};

const {width, height} = Dimensions.get('window');

const PdfProgressIndicator: React.FC<PdfProgressIndicatorProps> = ({file}) => {
  const uri = staticFileThumbnail(file.id);
  const tokens = useSnapshot(authState.tokens);

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
        nativeID={`pdf-${file.id}-dest`}
        style={imageStyle}
        source={{uri, headers: {Authorization: `Bearer ${tokens.accessToken}`}}}
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

export default PdfProgressIndicator;
