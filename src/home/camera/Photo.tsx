import {StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import Animated, {
  Keyframe,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';

type PhotoProps = {
  uri: string;
  translateY: Animated.SharedValue<number>;
  opacity: Animated.SharedValue<number>;
};

const {width, height} = Dimensions.get('window');
const SIZE = (width / 4) * 0.75;
const H_PADDING = 15;
const V_PADDING = H_PADDING * 2;

const entering = new Keyframe({
  from: {
    width,
    height,
    borderRadius: 0,
    borderWidth: 6,
    transform: [{translateX: 0}, {translateY: 0}],
  },
  to: {
    width: SIZE,
    height: SIZE,
    borderRadius: 10,
    borderWidth: 3,
    transform: [
      {translateX: width - SIZE - H_PADDING},
      {translateY: height - V_PADDING - SIZE - SIZE / 4},
    ],
  },
});

const Photo: React.FC<PhotoProps> = ({uri, translateY, opacity}) => {
  const rStyle = useAnimatedStyle(() => {
    return {opacity: opacity.value};
  });

  return (
    <Animated.View
      style={[styles.thumbnail, rStyle]}
      entering={entering.duration(500)}
      key={`asset-${uri}`}>
      <TouchableOpacity
        onPress={() => (translateY.value = withTiming(-height / 2))}>
        <FastImage source={{uri}} style={styles.image} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    position: 'absolute',
    borderColor: '#fff',
    overflow: 'hidden',
  },
  image: {
    width: SIZE,
    height: SIZE,
    resizeMode: 'cover',
  },
});

export default React.memo(Photo);
