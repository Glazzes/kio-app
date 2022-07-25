import {Extrapolate, interpolate} from 'react-native-reanimated';

type Resize = {
  width: number;
  height: number;
};

type CropPoint = {
  originX: number;
  originY: number;
  resize: Resize;
};

const crop = (
  layout: {width: number; height: number},
  realDimensions: {width: number; height: number},
  position: {x: number; y: number},
  scale: number,
  angle: number,
  radius: number,
  outputSize: number,
): CropPoint => {
  const offsetX = (layout.width * scale - radius * 2) / 2;
  const offsetY = (layout.height * scale - radius * 2) / 2;

  /*
    represents in a scale from 0 to 1 the maximun offset achievable
  */
  const xFactor = 1 - (radius * 2) / (layout.width * scale);
  const yFactor = 1 - (radius * 2) / (layout.height * scale);

  /*
    represents the top left corner (from 0 to 1)of the svg circle based on
    the current position on both axis
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

  // if the angle sits over the y axis dimensions are flipped
  if (angle === Math.PI / 2 || angle === (3 / 4) * 2 * Math.PI) {
    const dx = realDimensions.width;
    const dy = realDimensions.height;

    realDimensions.width = dy;
    realDimensions.height = dx;
  }

  // images are cropped based on their real dimensions and their current position
  const originX = realDimensions.width * positionX;
  const originY = realDimensions.height * positionY;

  // the smalller dimension is the one used to determine the crop size
  const size = Math.min(realDimensions.width, realDimensions.height) / scale;

  /*
  dividing the desired output size by the smaller dimension gives a value from 0 to 1 that
  can be used to resize the image by multiplyng it to the real image dimensions
  */
  const resizeFactor = outputSize / size;

  const resizedDimensions: Resize = {
    width: Math.ceil(realDimensions.width * resizeFactor),
    height: Math.ceil(realDimensions.height * resizeFactor),
  };

  return {
    originX: originX * resizeFactor,
    originY: originY * resizeFactor,
    resize: resizedDimensions,
  };
};

export default crop;
