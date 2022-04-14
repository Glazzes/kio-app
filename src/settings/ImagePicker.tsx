import {Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {Navigation} from 'react-native-navigation';
import {clamp} from '../utils/animations/clamp';
import {Box, Text} from 'native-base';

type ImagePickerProps = {
  translateY: Animated.SharedValue<number>;
};

const {topBarHeight, statusBarHeight} = Navigation.constantsSync();
const {width, height} = Dimensions.get('window');
export const SIZE = width - 50;
const effectiveHeight = height - statusBarHeight;

const ImagePicker: React.FC<ImagePickerProps> = ({translateY}) => {
  const scrollY = useSharedValue<number>(0);

  const translation = useDerivedValue<number>(() => {
    return clamp(
      -effectiveHeight,
      scrollY.value + translateY.value,
      effectiveHeight,
    );
  }, [scrollY.value, translateY.value]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      console.log('moving');
      scrollY.value = e.contentOffset.y * 0.8;
    },
  });

  const rStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translation.value,
      [effectiveHeight * 0.75, effectiveHeight],
      [20, 0],
      Extrapolate.CLAMP,
    );

    return {
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      transform: [{translateY: -translation.value}],
    };
  });

  return (
    <Animated.View style={[styles.root, rStyle]}>
      <Box width={width} px={4} py={2.5}>
        <Text fontWeight={'bold'}>Select a picture</Text>
      </Box>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        contentContainerStyle={styles.content}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    height: height - topBarHeight,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  content: {
    padding: 10,
    width,
    backgroundColor: '#3366ff',
    height: 1000,
  },
  select: {
    padding: 15,
    backgroundColor: 'lime',
  },
});

export default ImagePicker;
