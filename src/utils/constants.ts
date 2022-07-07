import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const thumbnailSize = width / 2;

const FONT = 'Uber';
const FONT_BOLD = 'UberBold';

export {thumbnailSize, FONT, FONT_BOLD};
