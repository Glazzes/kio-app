import {Dimensions, StyleSheet, Image, ImageStyle, View} from 'react-native';
import React, {useMemo} from 'react';
import {File} from '../../../../shared/types';
import {useSnapshot} from 'valtio';
import authState from '../../../../store/authStore';
import {staticFileThumbnail} from '../../../../shared/requests/contants';

type PdfThumnailProps = {
  file: File;
};

const {width} = Dimensions.get('window');
const SIZE = (width * 0.9 - 10) / 2;
const THUMBNAIL_WIDTH = SIZE * 0.85;

const PdfThumnail: React.FC<PdfThumnailProps> = ({file}) => {
  const thumbnail = staticFileThumbnail(file.id);
  const {accessToken} = useSnapshot(authState.tokens);

  const imageStyles: ImageStyle = useMemo(() => {
    const aspectRatio =
      (file.details.dimensions?.[0] ?? THUMBNAIL_WIDTH) /
      (file.details.dimensions?.[1] ?? THUMBNAIL_WIDTH);

    return {
      borderRadius: 5,
      width: THUMBNAIL_WIDTH,
      height: THUMBNAIL_WIDTH / aspectRatio,
    };
  }, [file]);

  return (
    <View style={styles.root}>
      <Image
        nativeID={`pdf-${file.id}`}
        source={{
          uri: thumbnail,
          headers: {Authorization: `Bearer ${accessToken}`},
        }}
        style={imageStyles}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: SIZE,
    height: SIZE,
    backgroundColor: '#f3f3f3',
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
  },
});

export default PdfThumnail;
