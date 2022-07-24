import {
  View,
  Text,
  StyleSheet,
  ListRenderItemInfo,
  Dimensions,
} from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {FlashList} from '@shopify/flash-list';

const {width} = Dimensions.get('window');
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const data = new Array(200).fill('Hello');

const FlashlistTest: React.FC = ({}) => {
  const ref = useAnimatedRef();

  const scrollY = useSharedValue<number>(0);

  const onScroll = useAnimatedScrollHandler<{y: number}>({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: -scrollY.value * 0.78}],
    };
  });

  return (
    <Animated.View style={styles.root}>
      <AnimatedFlashList ref={ref} data={data} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'salmon',
  },
  content: {
    width,
    height: 100,
    backgroundColor: 'tomato',
  },
});

export default FlashlistTest;
