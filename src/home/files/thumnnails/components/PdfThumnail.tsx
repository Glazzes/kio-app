import {
  Dimensions,
  StyleSheet,
  Image,
  ImageStyle,
  Pressable,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';

type PdfThumnailProps = {
  thumbnail: string;
  parentComponentId: string;
};

const {width} = Dimensions.get('window');
const SIZE = (width * 0.9 - 10) / 2;
const THUMBNAIL_WIDTH = SIZE * 0.85;

const PdfThumnail: React.FC<PdfThumnailProps> = ({thumbnail}) => {
  const [dimensions, setDimensions] = useState({width: 1, height: 1});

  const imageStyles: ImageStyle = useMemo(
    () => ({
      borderRadius: 3,
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
    <Pressable style={styles.root}>
      <Image source={{uri: thumbnail}} style={imageStyles} />
    </Pressable>
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
