import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const theme = {
  marginHorizontal: width * 0.05,
  width: width * 0.9,
};
