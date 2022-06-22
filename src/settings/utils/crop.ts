import {Extrapolate, interpolate} from 'react-native-reanimated';

type Resize = {
  width: number;
  height: number;
};

type CropPoint = {
  x: number;
  y: number;
  size: number;
  resize: Resize | null;
};

const crop = (
  layout: {width: number; height: number},
  realDimensions: {width: number; height: number},
  position: {x: number; y: number},
  scale: number,
  angle: number,
  radius: number,
  outputSize?: number,
): CropPoint => {
  const offsetX = (layout.width * scale - radius * 2) / 2;
  const offsetY = (layout.height * scale - radius * 2) / 2;

  /*
    represents in a scale from 0 to 1 how large is the image - svg circle size in comparision to
    the image layout size
  */
  const derivedWidth = 1 - (radius * 2) / (layout.width * scale);
  const deriveHeight = 1 - (radius * 2) / (layout.height * scale);

  /*
    we can determine at which point we are in the image by using using the offset in a "reverse"
    fashion
  */
  const positionX = interpolate(
    position.x,
    [-offsetX, offsetX],
    [derivedWidth, 0],
    Extrapolate.CLAMP,
  );

  const positionY = interpolate(
    position.y,
    [-offsetY, offsetY],
    [deriveHeight, 0],
    Extrapolate.CLAMP,
  );

  if (angle === Math.PI / 2 || angle === (3 / 4) * (Math.PI * 2)) {
    const dx = realDimensions.width;
    const dy = realDimensions.height;

    realDimensions.width = dy;
    realDimensions.height = dx;
  }

  // images are cropped based on their real dimensions and their current position
  const originX = realDimensions.width * positionX;
  const originY = realDimensions.height * positionY;
  const size = Math.min(realDimensions.width, realDimensions.height) / scale;

  /*
  dividing the smaller dimension by the desired output size gives a value from 0 to 1 that can be
  used to resize the image by multiplyng it to the real image dimensions
  */
  const resizeFactor = (outputSize ?? size) / size;

  const resizedDimensions: Resize = {
    width: Math.ceil(realDimensions.width * resizeFactor),
    height: Math.ceil(realDimensions.height * resizeFactor),
  };

  return {
    x: originX * resizeFactor,
    y: originY * resizeFactor,
    size: size * resizeFactor,
    resize: outputSize ? resizedDimensions : null,
  };
};

export default crop;
