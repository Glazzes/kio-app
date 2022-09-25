import {Dimensions} from 'react-native';
import {MAX_AUDIO_POINT} from '../constants';

const {width} = Dimensions.get('window');

export function convertAudioPointsToBarPoints(
  audioPoints: number[],
  waves?: number,
): number[] {
  const maxWaves = waves ?? width / 4;

  if (audioPoints.length < maxWaves) {
    return audioPoints.map(point => Math.abs(point));
  }

  const step = Math.max(1, Math.floor(audioPoints.length / maxWaves));
  const points: number[] = [];

  for (let i = 0; i < audioPoints.length; i += step) {
    let dataPoint =
      audioPoints
        .slice(i, i + step)
        .reduce((p1, p2) => Math.abs(p1) + Math.abs(p2)) / step;

    dataPoint = dataPoint / MAX_AUDIO_POINT;
    dataPoint = dataPoint < 0.25 ? dataPoint * 1.15 : dataPoint;

    points.push(dataPoint);
  }

  return points;
}
