import {Skia, SkPath} from '@shopify/react-native-skia';
import {
  LOWER_BAR_HEIGHT,
  STROKE_MARGIN,
  STROKE_WIDTH,
  UPPER_BAR_HEIGHT,
  WAVEFORMS_MARGIN,
} from '../constants';
import {WaveFormType} from '../types';

export function createWaveFormPath(
  barPoints: number[],
  type: WaveFormType,
  barHeight?: number,
): SkPath {
  const path = Skia.Path.Make();
  const currentBarHeight = barHeight ?? UPPER_BAR_HEIGHT;

  const x = STROKE_WIDTH + STROKE_MARGIN;
  const y = currentBarHeight + WAVEFORMS_MARGIN;
  for (let i = 0; i < barPoints.length; i++) {
    if (type === 'upper') {
      path.moveTo(x * i, currentBarHeight);
      path.lineTo(x * i, currentBarHeight - currentBarHeight * barPoints[i]);
    }

    if (type === 'lower') {
      path.moveTo(x * i, y);
      path.lineTo(x * i, y + LOWER_BAR_HEIGHT * barPoints[i]);
    }
  }

  return path;
}
