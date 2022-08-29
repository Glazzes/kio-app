import {ImageStyle} from 'react-native';
import {Dimension} from '../../../shared/types';

const getImageStyles = (dimensions: Dimension, radius: number): ImageStyle => {
  const aspectRatio = dimensions.width / dimensions.height;

  return {
    height: aspectRatio >= 1 ? radius * 2 : (2 * radius) / aspectRatio,
    width: aspectRatio >= 1 ? 2 * radius * aspectRatio : 2 * radius,
  };
};

export default getImageStyles;
