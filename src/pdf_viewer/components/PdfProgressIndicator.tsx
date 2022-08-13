import {StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import {
  BlurMask,
  Canvas,
  Fill,
  LinearGradient,
  Paint,
  Path,
  Skia,
  vec,
  useComputedValue,
} from '@shopify/react-native-skia';

type PdfProgressIndicatorProps = {
  progress: Animated.SharedValue<number>;
};

const {width, height} = Dimensions.get('window');
const RADIUS = 150;

const path = Skia.Path.Make();
path.moveTo(width / 2, height / 2);

const PdfProgressIndicator: React.FC<PdfProgressIndicatorProps> = ({
  progress,
}) => {
  const derivePath = useComputedValue(() => {
    path.addArc(
      {
        x: width / 2 - RADIUS / 2,
        y: height / 2 - RADIUS / 2,
        width: RADIUS,
        height: RADIUS,
      },
      270,
      360 * progress.value,
    );
    return path;
  }, [progress]);

  return (
    <Canvas style={styles.canvas}>
      <Fill color={'#000'} />

      <Path path={derivePath} color={'transparent'}>
        <Paint style={'stroke'} strokeWidth={8} strokeCap={'round'}>
          <LinearGradient
            colors={['#3366ff', '#ee3060']}
            start={vec(width / 2 - RADIUS, height / 2 - RADIUS)}
            end={vec(width / 2 + RADIUS, height / 2 + RADIUS)}
          />
          <BlurMask blur={5} style={'solid'} />
        </Paint>
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
