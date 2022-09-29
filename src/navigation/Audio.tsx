/* eslint-disable react-hooks/exhaustive-deps */
import {View, ViewStyle} from 'react-native';
import React, {useMemo} from 'react';
import {
  BlurMask,
  Canvas,
  Fill,
  LinearGradient,
  Path,
  vec,
} from '@shopify/react-native-skia';
import {convertAudioPointsToBarPoints} from '../audio_player/utils/functions/convertAudioPointsToBarPoints';
import {createWaveFormPath} from '../audio_player/utils/functions/createWaveFormPath';
import forest from '../home/files/thumnnails/assets/forest.json';

type AudioProps = {
  height: number;
  width: number;
  upperWaveHeight: number;
  lowerWaveHeight: number;
  backgroundColor?: string;
};

const STROKE_WIDTH = 3;

const Audio: React.FC<AudioProps> = ({
  height,
  width,
  upperWaveHeight,
  lowerWaveHeight,
  backgroundColor,
}) => {
  const styles: ViewStyle = useMemo(
    () => ({
      width,
      height,
      backgroundColor: backgroundColor ?? 'transparent',
    }),
    [],
  );

  const audioPoints = useMemo(() => {
    return convertAudioPointsToBarPoints(
      forest.data,
      Math.max(width, height) / 4,
    );
  }, []);

  const upperWaveForm = useMemo(() => {
    return createWaveFormPath(audioPoints, 'upper', upperWaveHeight);
  }, []);

  const lowerWaveForm = useMemo(() => {
    return createWaveFormPath(audioPoints, 'lower', lowerWaveHeight);
  }, []);

  return (
    <View style={styles}>
      <Canvas style={styles}>
        <Fill color={backgroundColor ?? 'transparent'} />
        <Path
          path={upperWaveForm}
          strokeWidth={STROKE_WIDTH}
          style={'stroke'}
          color={'#3366ff'}>
          <LinearGradient
            colors={['#3366ff', '#0b4199', '#3366ff']}
            start={vec(0, 0)}
            end={vec(width, upperWaveHeight)}
          />
          <BlurMask blur={2} style={'solid'} />
        </Path>
        <Path
          path={lowerWaveForm}
          strokeWidth={STROKE_WIDTH}
          style={'stroke'}
          color={'rgba(51, 102, 205, 0.6)'}>
          <BlurMask blur={1} style={'solid'} />
        </Path>
      </Canvas>
    </View>
  );
};

export default Audio;
