import {StyleSheet, Dimensions} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Camera} from 'expo-camera';
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

type PickerPictureProps = {
  asset: Asset;
  index: number;
};

const {width} = Dimensions.get('window');

const PADDING = 5;
const SIZE = width / 3 - PADDING * 2;

const PickerPicture: React.FC<PickerPictureProps> = ({asset}) => {
  const radius = useRef(Math.sqrt(SIZE ** 2 + SIZE ** 2)).current;

  const onSelectedPicture = () => {
    emitter.emit('picture.selected', asset);
  };

  const translate = useVector(0, 0);
  const scale = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(1);

  const dummy = useSharedValue<number>(1);
  const tap = Gesture.Tap()
    .onBegin(e => {
      translate.x.value = e.x;
      translate.y.value = e.y;
    })
    .onEnd(() => {
      scale.value = withTiming(1, {duration: 300}, finished => {
        if (finished) {
          scale.value = 0;
        }
      });

      opacity.value = withTiming(0, {duration: 300}, finished => {
        if (finished) {
          opacity.value = 1;
        }
      });

      dummy.value = withTiming(0, {duration: 150}, finished => {
        if (finished) {
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
      backgroundColor: '#rgba(0, 0, 0, 0.4)',
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermissionsAsync();
    })();
  }, []);

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={styles.tile}>
        <Animated.Image
          nativeID={`${asset.uri}`}
          source={{uri: asset.uri}}
          style={styles.image}
          resizeMode={'cover'}
        />
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
