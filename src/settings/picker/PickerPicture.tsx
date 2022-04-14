import {StyleSheet} from 'react-native';
import React from 'react';
import {SIZE} from '../ImagePicker';
import {Camera} from 'expo-camera';
import {Image} from 'native-base';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import emitter from '../../utils/emitter';

type PickerPictureProps = {
  index: number;
  uri: string;
};

const PickerPicture: React.FC<PickerPictureProps> = ({index, uri}) => {
  const onSelectedPicture = () => {
    emitter.emit('picture.selected', {uri});
  };

  return (
    <TouchableWithoutFeedback style={styles.tile} onPress={onSelectedPicture}>
      {index === 0 ? (
        <Camera type={'front'} />
      ) : (
        <Image
          source={{uri}}
          width={SIZE}
          height={SIZE}
          resizeMode={'contain'}
        />
      )}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: SIZE,
    height: SIZE,
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default React.memo(PickerPicture);
