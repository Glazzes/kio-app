import {StyleSheet, Dimensions} from 'react-native';
import React, {useEffect} from 'react';
import {Camera} from 'expo-camera';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import emitter from '../../utils/emitter';
import FastImage from 'react-native-fast-image';
import {Asset} from 'expo-media-library';

type PickerPictureProps = {
  asset: Asset;
  index: number;
};

const {width} = Dimensions.get('window');

const PADDING = 5;
const SIZE = width / 3 - PADDING * 2;

const PickerPicture: React.FC<PickerPictureProps> = ({index, asset}) => {
  const onSelectedPicture = () => {
    emitter.emit('picture.selected', {uri: asset.uri});
  };

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermissionsAsync();
    })();
  });

  return (
    <TouchableWithoutFeedback style={styles.tile}>
      <FastImage
        source={{uri: asset.uri}}
        style={styles.image}
        resizeMode={'cover'}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: SIZE,
    height: SIZE,
    margin: PADDING,
    borderRadius: PADDING,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
});

export default React.memo(PickerPicture);
