import {View, Dimensions, StyleSheet, Text, FlatListProps} from 'react-native';
import {
  FlashList,
  FlashListProps,
  ListRenderItemInfo,
} from '@shopify/flash-list';
import Folder from '../../src/home/Folder';
import React, {useEffect, useState} from 'react';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';
import {snapPoint} from 'react-native-redash';
import ImageThumbnail from '../home/files/thumnnails/ImageThumbnail';
import {File} from '../utils/types';
import SearchBar from './SearchBar';
import emitter from '../utils/emitter';

type FolderListProps = {};

const {width} = Dimensions.get('window');
const SIZE = width * 0.75;

const data = new Array(5).fill(0);

function keyExtractor(item: number, index: number) {
  return `folder-${index}`;
}

function renderItem(info: ListRenderItemInfo<number>) {
  return (
    <ImageThumbnail
      index={0}
      image={{id: '', name: ''} as File}
      selectedIndex={val}
    />
  );
}

const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<number>>(FlashList);

const AnimatedGHFlatlist =
  Animated.createAnimatedComponent<FlatListProps<number>>(FlatList);

const FolderList: React.FC<FolderListProps> = ({}) => {
  const ref = useAnimatedRef<FlatList<string>>();
  const scrollX = useSharedValue<number>(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
    },
  });

  return (
    <View style={styles.root}>
      <View style={{height: 400, width, backgroundColor: 'tomato'}}>
        <AnimatedGHFlatlist
          ListHeaderComponent={() => {
            return <SearchBar />;
          }}
          ref={ref}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          data={data}
          nestedScrollEnabled={true}
          renderItem={info => {
            return (
              <ImageThumbnail
                index={info.index}
                image={{id: '', name: ''} as File}
                selectedIndex={scrollX}
              />
            );
          }}
          keyExtractor={keyExtractor}
          estimatedItemSize={150}
          onScroll={onScroll}
          contentContainerStyle={styles.content}
          estimatedListSize={{height: 150 * (data.length / 2), width}}
        />
      </View>
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
