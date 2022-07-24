import {StyleSheet, Dimensions, View, Pressable, Image} from 'react-native';
import React from 'react';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import emitter from '../../utils/emitter';
import {Asset} from 'expo-media-library';

type PickerPictureProps = {
  asset: Asset;
  index: number;
};

const {width} = Dimensions.get('window');

const PADDING = 5;
const SIZE = width / 3 - PADDING * 2;

const PickerPicture: React.FC<PickerPictureProps> = ({asset, index}) => {
  const devices = useCameraDevices();

  const onSelectedPicture = () => {
    emitter.emit('picture.selected', asset);
  };

  return (
    <Pressable
      onPress={onSelectedPicture}
      style={({pressed}) => {
        return [styles.tile, {opacity: pressed ? 0.75 : 1}];
      }}>
      {index === 0 ? (
        <View style={styles.image}>
          {devices.front == null ? null : (
            <Camera
              isActive={true}
              device={devices.front}
              style={styles.image}
            />
          )}
        </View>
      ) : (
        <Image
          nativeID={`asset-${asset.id}`}
          source={{uri: asset.uri}}
          style={styles.image}
          resizeMode={'cover'}
        />
      )}
    </Pressable>
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
