import {StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import emitter from '../../utils/emitter';
import {Asset} from 'expo-media-library';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useVector} from 'react-native-redash';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {View} from 'native-base';

type PickerPictureProps = {
  asset: Asset;
  index: number;
};

const {width} = Dimensions.get('window');

const PADDING = 5;
const SIZE = width / 3 - PADDING * 2;
const radius = Math.SQRT2 * SIZE;

const PickerPicture: React.FC<PickerPictureProps> = ({asset, index}) => {
  const devices = useCameraDevices();

  const onSelectedPicture = () => {
    emitter.emit('picture.selected', asset);
  };

  const translate = useVector(0, 0);
  const scale = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(1);

  const tap = Gesture.Tap()
    .onBegin(e => {
      translate.x.value = e.x;
      translate.y.value = e.y;
    })
    .onEnd(() => {
      opacity.value = withTiming(0, {duration: 450});
      scale.value = withTiming(1, {duration: 300}, finished => {
        if (finished) {
          scale.value = withTiming(0, {duration: 300});
          runOnJS(onSelectedPicture)();
        }
      });
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: -radius,
      left: -radius,
      height: radius * 2,
      width: radius * 2,
      borderRadius: radius,
      transform: [
        {translateX: translate.x.value},
        {translateY: translate.y.value},
        {scale: scale.value},
      ],
      backgroundColor: '#rgba(0, 0, 0, 0.3)',
      opacity: opacity.value,
    };
  });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={styles.tile}>
        {index === 0 ? (
          <View style={{flex: 1}}>
            {devices.front == null ? null : (
              <Camera
                isActive={true}
                device={devices.front}
                style={styles.image}
              />
            )}
          </View>
        ) : (
          <Animated.Image
            nativeID={`${asset.uri}`}
            source={{uri: asset.uri}}
            style={styles.image}
            resizeMethod={'resize'}
            resizeMode={'cover'}
          />
        )}
        <Animated.View style={rStyle} />
      </Animated.View>
    </GestureDetector>
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
