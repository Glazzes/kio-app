import {View, Dimensions, StyleSheet} from 'react-native';
import {
  FlashList,
  FlashListProps,
  ListRenderItemInfo,
} from '@shopify/flash-list';
import Folder from '../../src/home/Folder';
import React from 'react';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {snapPoint} from 'react-native-redash';

type FolderListProps = {};

const {width} = Dimensions.get('window');
const SIZE = width * 0.75;

const data = new Array(10).fill(0);

function keyExtractor(_: number, index: number) {
  return `folder-${index}`;
}

function renderItem(info: ListRenderItemInfo<number>) {
  return <Folder />;
}

const AniamtedFL =
  Animated.createAnimatedComponent<FlashListProps<number>>(FlashList);

const FolderList: React.FC<FolderListProps> = ({}) => {
  const ref = useAnimatedRef();
  const scrollX = useSharedValue<number>(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
    },
    onEndDrag: e => {
      const points = data.map((_, index) => {
        return width * 0.75 * index;
      });

      const snap = snapPoint(scrollX.value, e.velocity?.x ?? 0, points);
      scrollTo(ref, snap, 0, true);
    },
  });

  return (
    <View style={styles.root}>
      <AniamtedFL
        ref={ref}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={SIZE}
        contentContainerStyle={styles.content}
        estimatedListSize={{height: 135, width: SIZE * data.length}}
        onScroll={onScroll}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
  },
  content: {
    paddingHorizontal: width * 0.05,
  },
});

export default FolderList;
