import {StyleSheet} from 'react-native';
import React from 'react';
import {File} from '../../../utils/types';
import authStore from '../../../store/authStore';
import {thumbnailSize} from '../../../utils/constants';
import {useVector} from 'react-native-redash';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Star from '../folder/Star';

type ImageThumbnailProps = {
  image: File;
  index: number;
  selectedIndex: Animated.SharedValue<number>;
};

const uri = 'file:///storage/sdcard0/Descargas/fox.jpg';

const center = {
  x: thumbnailSize / 2,
  y: (thumbnailSize * 0.6) / 2,
};

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({
  image,
  selectedIndex,
  index,
}) => {
  const accessToken = authStore(state => state.accessToken);

  const translate = useVector(0, 0);
  const origin = useVector(0, 0);
  const scale = useSharedValue<number>(1);
  const canPinch = useSharedValue<boolean>(true);
  const opacity = useSharedValue<number>(1);
  const elevation = useSharedValue<number>(0);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      opacity.value = withTiming(0, {duration: 150});
      selectedIndex.value = index;
    })
    .onChange(e => {
      const adjustedFocal = {
        x: e.focalX - center.x,
        y: e.focalY - center.y,
      };

      if (canPinch.value) {
        origin.x.value = adjustedFocal.x;
        origin.y.value = adjustedFocal.y;
        canPinch.value = false;
      }

      translate.x.value =
        adjustedFocal.x -
        origin.x.value +
        origin.x.value +
        -1 * e.scale * origin.x.value;

      translate.y.value =
        adjustedFocal.y -
        origin.y.value +
        origin.y.value +
        -1 * e.scale * origin.y.value;

      scale.value = e.scale;
    })
    .onEnd(() => {
      canPinch.value = true;
      origin.x.value = 0;
      origin.y.value = 0;
      scale.value = withTiming(1, {duration: 150}, hasFinished => {
        if (hasFinished) {
          opacity.value = withTiming(1);
          selectedIndex.value = 0;
        }
      });

      translate.x.value = withTiming(0);
      translate.y.value = withTiming(0);
    });

  const imageStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translate.x.value},
        {translateY: translate.y.value},
        {scale: scale.value},
      ],
    };
  });

  const containerStyles = useAnimatedStyle(() => {
    return {
      // position: 'absolute',
      // top: (thumbnailSize * 0.65 + 10) * index,
      marginVertical: 5,
      elevation: elevation.value,
    };
  });

  useAnimatedReaction(
    () => selectedIndex.value,
    value => {
      elevation.value = value === index ? 0 : -1;
    },
  );

  return (
    <Animated.View
      entering={ZoomIn.delay(index * 300)}
      exiting={ZoomOut.delay(300)}
      style={[styles.root, containerStyles]}>
      <GestureDetector gesture={pinch}>
        {/*
           Wrapping the view that's gonna be pinched within a dummy animated view
           for some reason allows for a better pinch gesture
           */}
        <Animated.View style={[styles.thumb]}>
          <Animated.View style={[styles.thumb, imageStyles]}>
            <Animated.Image
              nativeID={`img-${image.id}`}
              style={[styles.image]}
              source={{uri, headers: {Authorization: accessToken}}}
              resizeMode={'cover'}
              resizeMethod={'scale'}
            />
            <Star opacity={opacity} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: 300,
    height: 140,
  },
  thumb: {
    width: 300,
    height: 140,
    borderRadius: 10,
    backgroundColor: 'lightgrey',
  },
  image: {
    flex: 1,
    borderRadius: 10,
  },
});

export default React.memo(ImageThumbnail);
