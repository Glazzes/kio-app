import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
export const SIZE = (width * 0.9 - 10) / 2;

export const compressedTypes = [
  'application/x-7z-compressed',
  'application/zip',
  'application/x-tar',
  'application/vnd.rar',
];

export const codeTypes = [
  'application/x-sh',
  'application/xml',
  'application/xhtml+xml',
  'application/json',
];
