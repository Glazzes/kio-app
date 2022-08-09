import {MAX_AUDIO_POINT, MAX_WAVES} from '../constants';

export function convertAudioPointsToBarPoints(audioPoints: number[]): number[] {
  if (audioPoints.length < MAX_WAVES) {
    return audioPoints.map(point => Math.abs(point));
  }

  const step = Math.max(1, Math.floor(audioPoints.length / MAX_WAVES));
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
