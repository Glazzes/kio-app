import {Dimensions, StyleSheet, Image, ImageStyle, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {File} from '../../../../shared/types';
import {host} from '../../../../shared/constants';
import {useSnapshot} from 'valtio';
import authState from '../../../../store/authStore';

type PdfThumnailProps = {
  file: File;
};

const {width} = Dimensions.get('window');
const SIZE = (width * 0.9 - 10) / 2;
const THUMBNAIL_WIDTH = SIZE * 0.85;

const PdfThumnail: React.FC<PdfThumnailProps> = ({file}) => {
  const thumbnail = `${host}/static/file/${file.id}/thumbnail`;
  const {accessToken} = useSnapshot(authState.tokens);
  const [dimensions, setDimensions] = useState({width: 1, height: 1});

  const imageStyles: ImageStyle = useMemo(
    () => ({
      borderRadius: 5,
      width: THUMBNAIL_WIDTH,
      height: THUMBNAIL_WIDTH / (dimensions.width / dimensions.height),
    }),
    [dimensions],
  );

  useEffect(() => {
    Image.getSize(thumbnail, (w, h) => {
      setDimensions({width: w, height: h});
    });
  }, [thumbnail]);

  return (
    <View style={styles.root}>
      <Image
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
