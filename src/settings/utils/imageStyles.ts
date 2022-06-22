import {ViewStyle} from 'react-native';

const imageStyles = (
  dimensions: {
    width: number;
    height: number;
  },
  radius: number,
): ViewStyle => {
  const aspectRatio = dimensions.width / dimensions.height;
  const styles: ViewStyle = {
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

export default imageStyles;
