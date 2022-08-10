import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

export const MAX_AUDIO_POINT = 127;

export const CANVAS_HEIGHT = 180;

export const UPPER_BAR_HEIGHT = 140;
export const LOWER_BAR_HEIGHT = 30;

export const WAVEFORMS_MARGIN = 2;

export const STROKE_WIDTH = 3;
export const STROKE_MARGIN = 1;

export const MAX_WAVES = width / (STROKE_MARGIN + STROKE_WIDTH) + 1;
