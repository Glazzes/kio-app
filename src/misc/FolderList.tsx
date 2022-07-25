import {View, Dimensions, StyleSheet, Text} from 'react-native';
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

const AnimatedFlashList =
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
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Folders</Text>
        <Text style={styles.subtitle}>
          You've got <Text style={styles.count}>{data.length} </Text> subfolders
          within this folder
        </Text>
      </View>
      <AnimatedFlashList
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
    marginVertical: 5,
  },
  content: {
    paddingLeft: width * 0.05,
  },
  infoContainer: {
    marginLeft: width * 0.05,
    marginVertical: 5,
  },
  title: {
    fontFamily: 'UberBold',
    fontSize: 15,
    marginBottom: 5,
    color: '#000',
  },
  subtitle: {
    fontFamily: 'Uber',
    fontSize: 12,
  },
  count: {
    fontFamily: 'Uber',
    color: '#3366ff',
    fontSize: 12,
  },
});

export default FolderList;
