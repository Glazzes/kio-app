import {StyleSheet, Dimensions} from 'react-native';
import React, {useEffect} from 'react';
import {Camera} from 'expo-camera';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import emitter from '../../utils/emitter';
import FastImage from 'react-native-fast-image';

type PickerPictureProps = {
  index: number;
  uri: string;
};

const {width} = Dimensions.get('window');

const PADDING = 5;
const SIZE = width / 3 - PADDING * 2;

const PickerPicture: React.FC<PickerPictureProps> = ({index, uri}) => {
  const onSelectedPicture = () => {
    emitter.emit('picture.selected', {uri});
  };

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermissionsAsync();
    })();
  });

  return (
    <TouchableWithoutFeedback style={styles.tile} onPress={onSelectedPicture}>
      {index === 0 ? (
        <Camera type={'front'} style={styles.camera} />
      ) : (
        <FastImage source={{uri}} style={styles.tile} />
      )}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  camera: {
    width: SIZE,
    heigt: SIZE,
  },
  tile: {
    width: SIZE,
    height: SIZE,
    borderRadius: PADDING,
    overflow: 'hidden',
    margin: PADDING,
  },
});

export default React.memo(PickerPicture);
