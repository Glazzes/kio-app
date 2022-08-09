import {Dimension, ImageStyle} from '../../../shared/types';

const getImageStyles = (dimensions: Dimension, radius: number): ImageStyle => {
  const aspectRatio = dimensions.width / dimensions.height;
  const styles: ImageStyle = {
    width: undefined,
    height: undefined,
    maxWidth: undefined,
    maxHeight: undefined,
    aspectRatio,
  };

  if (aspectRatio >= 1) {
    styles.height = radius * 2;
    styles.maxHeight = radius * 2;
  } else {
    styles.width = radius * 2;
    styles.maxWidth = radius * 2;
  }

  return styles;
};

export default getImageStyles;
