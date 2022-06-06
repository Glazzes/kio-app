import {View, StyleSheet} from 'react-native';
import React from 'react';
import {thumbnailSize} from '../../../utils/constants';

type AudioThumbnailProps = {};

const waves = new Array(50).fill(0).map(_ => Math.max(0.1, Math.random()));

const AudioThumbnail: React.FC<AudioThumbnailProps> = ({}) => {
  return (
    <View style={styles.root}>
      <View style={styles.waveContainer}>
        {waves.map((h, index) => {
          return (
            <View
              key={`wave-${index}`}
              style={[{height: 120 * h}, styles.wave]}
            />
          );
        })}
      </View>
      <View style={styles.invertedContainer}>
        {waves.map((h, index) => {
          return (
            <View
              key={`inverted-wave-${index}`}
              style={[{height: 40 * h}, styles.wave]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: thumbnailSize,
    height: thumbnailSize * 0.65,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 5,
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
