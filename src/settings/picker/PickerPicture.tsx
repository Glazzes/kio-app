import {StyleSheet, Dimensions, View, Pressable, Image} from 'react-native';
import React from 'react';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import emitter from '../../shared/emitter';
import {Asset} from 'expo-media-library';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type PickerPictureProps = {
  asset: Asset;
  index: number;
};

const {width} = Dimensions.get('window');

const PADDING = 5;
const SIZE = width / 3 - PADDING * 2;
const ICON_SIZE = 35;

const PickerPicture: React.FC<PickerPictureProps> = ({asset, index}) => {
  const devices = useCameraDevices();

  const onSelectedPicture = async () => {
    if (index === 0) {
      emitter.emit('push.camera');
      return;
    }

    emitter.emit('picture.selected', asset);
  };

  return (
    <Pressable onPress={onSelectedPicture} style={styles.tile}>
      {index === 0 ? (
        <View style={styles.image}>
          {devices.front == null ? null : (
            <Camera
              isActive={true}
              device={devices.front}
              style={styles.image}
            />
          )}
          <Icon
            name={'camera'}
            size={ICON_SIZE}
            color={'#fff'}
            style={styles.icon}
          />
        </View>
      ) : (
        <Image
          nativeID={`asset-${asset.uri}`}
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
  icon: {
    position: 'absolute',
    top: SIZE / 2 - ICON_SIZE / 2,
    left: SIZE / 2 - ICON_SIZE / 2,
  },
});

export default React.memo(PickerPicture);
