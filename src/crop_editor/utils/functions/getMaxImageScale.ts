import {Dimension} from '../../../shared/types';

export function getMaxImageScale(
  layout: Dimension,
  dimensions: Dimension,
  rotationAngle: number,
): number {
  'worklet';
  if (rotationAngle === 0 || rotationAngle === Math.PI) {
    return (
      Math.max(dimensions.height, dimensions.width) /
      Math.max(layout.width, layout.height)
    );
  }

  return (
    Math.max(dimensions.height, dimensions.width) /
    Math.min(layout.width, layout.height)
  );
  /*
  return dimensions.height > dimensions.width
    ? dimensions.height / layout.x.value
    : dimensions.width / layout.y.value;
*/
}
