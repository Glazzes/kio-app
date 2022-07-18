import {StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import Animated, {Keyframe, useAnimatedStyle} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';

type CameraThumnailProps = {
  uri: string;
  opacity: Animated.SharedValue<number>;
};

const {width} = Dimensions.get('window');
const SIZE = (width / 4) * 0.6;

const entering = new Keyframe({
  from: {
    opacity: 0.75,
    transform: [{translateY: -(SIZE * 2)}],
  },
  to: {
    opacity: 1,
    transform: [{translateY: ((width / 4) * 0.75 - SIZE) / 2}],
  },
});

const CameraThumbnail: React.FC<CameraThumnailProps> = ({uri, opacity}) => {
  const rStyle = useAnimatedStyle(() => {
    return {opacity: opacity.value};
  });

  return (
    <Animated.View
      style={[styles.thumbnail, rStyle]}
      entering={entering.duration(500)}
      key={`asset-${uri}`}>
      <FastImage source={{uri}} style={styles.image} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  image: {
    width: SIZE,
    height: SIZE,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 5,
    resizeMode: 'cover',
  },
});

export default React.memo(CameraThumbnail);
