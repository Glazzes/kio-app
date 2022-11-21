import {Extrapolate, interpolate} from 'react-native-reanimated';
import {Dimension, Point} from '../../../shared/types';
import {CropPoint, Resize} from '../../types';

type CropOptions = {
  layout: Dimension;
  imageDimensions: Dimension;
  position: Point;
  angle: number;
  scale: number;
  radius: number;
  cropSize: number;
};

const crop = (options: CropOptions): CropPoint => {
  const {layout, imageDimensions, position, angle, scale, radius, cropSize} =
    options;

  const offsetX = (layout.width * scale - radius * 2) / 2;
  const offsetY = (layout.height * scale - radius * 2) / 2;

  // represents in a scale from 0 to 1 the maximun offset achievable
  const xFactor = 1 - (radius * 2) / (layout.width * scale);
  const yFactor = 1 - (radius * 2) / (layout.height * scale);

  /*
    represents the top left corner (from 0 to 1) of the svg circle based on
    the current position on both axis and the layout dimensions
  */
  let positionX = interpolate(
    position.x,
    [-offsetX, offsetX],
    [xFactor, 0],
    Extrapolate.CLAMP,
  );

  let positionY = interpolate(
    position.y,
    [-offsetY, offsetY],
    [yFactor, 0],
    Extrapolate.CLAMP,
  );

  const actualDimensions = {...imageDimensions};

  // if the angle sits over the y axis dimensions are flipped
  if (angle % Math.PI === Math.PI / 2) {
    actualDimensions.width = imageDimensions.height;
    actualDimensions.height = imageDimensions.width;
  }

  // images are cropped based on their real dimensions and their current position
  const originX = actualDimensions.width * positionX;
  const originY = actualDimensions.height * positionY;

  // the smalller dimension is the one used to determine the crop size
  const size =
    Math.min(actualDimensions.width, actualDimensions.height) / scale;

  /*
  dividing the desired output size by the smaller dimension gives a value from 0 to 1 that
  can be used to resize the image by multiplyng it to the real image dimensions
  */
  const resizeFactor = cropSize / size;

  const resizedDimensions: Resize = {
    width: Math.ceil(imageDimensions.width * resizeFactor),
    height: Math.ceil(imageDimensions.height * resizeFactor),
  };

  return {
    originX: originX * resizeFactor,
    originY: originY * resizeFactor,
    resize: resizedDimensions,
  };
};

export default crop;
