/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, Pressable} from 'react-native';
import React, {useMemo} from 'react';
import {
  BlurMask,
  Canvas,
  LinearGradient,
  Path,
  vec,
} from '@shopify/react-native-skia';
import {convertAudioPointsToBarPoints} from '../../../../audio_player/utils/functions/convertAudioPointsToBarPoints';
import {createWaveFormPath} from '../../../../audio_player/utils/functions/createWaveFormPath';
import json from '../assets/waves.json';
import forest from '../assets/forest.json';
import {STROKE_WIDTH} from '../../../../audio_player/utils/constants';
import {Navigation} from 'react-native-navigation';
import {Screens} from '../../../../enums/screens';
import {SIZE} from '../utils/constants';

type AudioThumbnailProps = {
  parentComponentId: string;
  index: number;
};

const AudioThumbnail: React.FC<AudioThumbnailProps> = ({
  index,
  parentComponentId,
}) => {
  const audioPoints = useMemo(() => {
    return convertAudioPointsToBarPoints(
      index % 2 === 0 ? forest.data : json.data,
      35,
    );
  }, []);

  const upperWaveForm = useMemo(() => {
    return createWaveFormPath(audioPoints, 'upper', SIZE * 0.75);
  }, []);

  const lowerWaveForm = useMemo(() => {
    return createWaveFormPath(audioPoints, 'lower', SIZE * 0.755);
  }, []);

  const goToAudioPlayer = () => {
    Navigation.push(parentComponentId, {
      component: {
        name: Screens.AUDIO_PLAYER,
      },
    });
  };

  return (
    <Pressable style={styles.root} onPress={goToAudioPlayer}>
      <Canvas style={styles.canvas}>
        <Path
          path={upperWaveForm}
          strokeWidth={STROKE_WIDTH}
          style={'stroke'}
          color={'#3366ff'}>
          <LinearGradient
            colors={['#3366ff', '#0b4199', '#3366ff']}
            start={vec(0, 0)}
            end={vec(SIZE, SIZE * 0.75)}
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
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    width: SIZE,
    height: SIZE,
    backgroundColor: '#f3f3f3',
    borderRadius: 5,
  },
  canvas: {
    height: SIZE,
    width: SIZE,
  },
  wave: {
    backgroundColor: '#3366ff',
    width: 3,
    marginHorizontal: 1,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  invertedContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    opacity: 0.5,
  },
});

export default AudioThumbnail;
