import {
  View,
  Text,
  StyleSheet,
  ListRenderItemInfo,
  Dimensions,
} from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {AnimatedFlashList, FlashList} from '@shopify/flash-list';

type FlashlistTestProps = {};

const {width} = Dimensions.get('window');
const items: string[] = [
  'one',
  'two',
  'three',
  'four',
  'one',
  'two',
  'three',
  'four',
  'one',
  'two',
  'three',
  'four',
];

function renderItem(info: ListRenderItemInfo<string>): React.ReactElement {
  return (
    <Text style={{height: 50, width}} key={`${info.item}-${info.index}`}>
      {info.item}
    </Text>
  );
}

const AA = Animated.createAnimatedComponent(FlashList);

const FlashlistTest: React.FC<FlashlistTestProps> = ({}) => {
  const scrollY = useSharedValue<number>(0);

  const onScroll = useAnimatedScrollHandler<{y: number}>({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
      console.log(scrollY.value);
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: -scrollY.value}],
    };
  });

  return (
    <Animated.View style={[rStyle, {width, flex: 1, backgroundColor: 'lime'}]}>
      <AA
        data={items}
        renderItem={({item}) => {
          return (
            <Text style={{height: 50, width}} key={`${item}}`}>
              {item}
            </Text>
          );
        }}
        estimatedItemSize={100}
        onScroll={onScroll}
        contentContainerStyle={styles.content}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'salmon',
  },
});

export default FlashlistTest;
