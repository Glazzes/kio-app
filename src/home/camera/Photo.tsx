import {StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import Animated, {Keyframe, useAnimatedStyle} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';

type PhotoProps = {
  uri: string;
  opacity: Animated.SharedValue<number>;
};

const {width} = Dimensions.get('window');
const SIZE = (width / 4) * 0.6;
const H_PADDING = 15;
const V_PADDING = H_PADDING * 2;

const entering = new Keyframe({
  from: {
    opacity: 0.6,
    transform: [{translateY: -(SIZE + V_PADDING)}],
  },
  to: {
    opacity: 1,
    transform: [{translateY: 0}],
  },
});

const Photo: React.FC<PhotoProps> = ({uri, opacity}) => {
  const rStyle = useAnimatedStyle(() => {
    return {opacity: opacity.value};
  });

  return (
    <Animated.View
      style={[styles.thumbnail, rStyle]}
      entering={entering.duration(1000)}
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
    borderRadius: 10,
    resizeMode: 'cover',
  },
});

export default React.memo(Photo);
