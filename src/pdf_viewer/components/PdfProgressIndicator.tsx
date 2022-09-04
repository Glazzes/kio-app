import {StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import {
  BlurMask,
  Canvas,
  Fill,
  Path,
  Skia,
  useValue,
  useSharedValueEffect,
} from '@shopify/react-native-skia';

type PdfProgressIndicatorProps = {
  progress: Animated.SharedValue<number>;
};

const {width, height} = Dimensions.get('window');
const RADIUS = 150;

const path = Skia.Path.Make();
path.moveTo(width / 2, height / 2);
path.addArc(
  {
    x: width / 2 - RADIUS / 2,
    y: height / 2 - RADIUS / 2,
    width: RADIUS,
    height: RADIUS,
  },
  270,
  359.9,
);

const PdfProgressIndicator: React.FC<PdfProgressIndicatorProps> = ({
  progress,
}) => {
  const end = useValue(0);

  useSharedValueEffect(() => {
    end.current = progress.value;
  }, progress);

  return (
    <Canvas style={styles.canvas}>
      <Fill color={'#000'} />
      <Path
        path={path}
        style={'stroke'}
        strokeWidth={10}
        strokeCap={'round'}
        color={'#fff'}
        end={end}>
        <BlurMask blur={5} style={'solid'} />
      </Path>
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    width,
    height,
  },
});

export default PdfProgressIndicator;
