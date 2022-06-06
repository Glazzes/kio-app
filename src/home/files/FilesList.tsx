import {
  ListRenderItemInfo,
  Dimensions,
  StyleSheet,
  FlatListProps,
  View,
} from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import ImageThumbnail from './thumnnails/ImageThumbnail';
import {File} from '../../utils/types';

type FilesListProps = {};

const {width} = Dimensions.get('window');

const AnimatedGHScrollView = Animated.createAnimatedComponent(ScrollView);

const data: number[] = [1, 2, 3, 4, 5];

function keyExtractor(item: number, _: number): string {
  return `item-${item}`;
}

const FilesList: React.FC<FilesListProps> = ({}) => {
  const translateFAB = useSharedValue<number>(0);

  const selectedIndex = useSharedValue<number>(-1);
  const onScroll = useAnimatedScrollHandler<{y: number}>({
    onScroll: (e, ctx) => {
      const delta = e.contentOffset.y - (ctx.y ?? 0);
      const direction = Math.sign(delta);
      translateFAB.value = withTiming(direction === -1 ? 200 : 0);
      ctx.y = e.contentOffset.y;
    },
  });

  function renderItem(info: ListRenderItemInfo<number>): React.ReactElement {
    return (
      <ImageThumbnail
        image={{} as File}
        index={info.index}
        selectedIndex={selectedIndex}
      />
    );
  }

  return (
    <View style={styles.root}>
      <AnimatedGHScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}>
        {data.map((_, index) => {
          return (
            <ImageThumbnail
              key={`img-thmb-${index}`}
              image={{} as File}
              index={index}
              selectedIndex={selectedIndex}
            />
          );
        })}
      </AnimatedGHScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    width,
    height: 1000,
    alignItems: 'center',
  },
});

export default FilesList;
