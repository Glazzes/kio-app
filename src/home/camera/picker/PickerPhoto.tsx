import {View, StyleSheet, Dimensions} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';

type PickerPhotoProps = {
  uri: string;
};

const {width} = Dimensions.get('window');

const PADDING = 5;
const SIZE = width / 3 - PADDING * 2;

const PickerPhoto: React.FC<PickerPhotoProps> = ({uri}) => {
  const [selected, setSelected] = useState<boolean>(false);

  return (
    <View style={styles.tile}>
      <FastImage source={{uri}} style={styles.image} resizeMode={'cover'} />
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: SIZE,
    height: SIZE,
    marginHorizontal: PADDING,
    marginVertical: PADDING,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
});

export default PickerPhoto;
