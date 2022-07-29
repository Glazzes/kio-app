import {View, StyleSheet, Dimensions, Image, Text} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {snapPoint} from 'react-native-redash';
import {
  FlashList,
  FlashListProps,
  ListRenderItemInfo,
} from '@shopify/flash-list';

type ContributorsProps = {};

const {width} = Dimensions.get('window');

const photos = [
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/women/21.jpg',
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/men/81.jpg',
  'https://randomuser.me/api/portraits/men/68.jpg',
  'https://randomuser.me/api/portraits/men/81.jpg',
  'https://randomuser.me/api/portraits/men/68.jpg',
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/men/81.jpg',
];

const SIZE = 45;

const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<string>>(FlashList);

function keyExtractor(item: string, index: number): string {
  return `${item}-${index}`;
}

function renderItem(info: ListRenderItemInfo<string>) {
  return <Image source={{uri: info.item}} style={styles.photo} />;
}

const Contributors: React.FC<ContributorsProps> = ({}) => {
  const ref = useAnimatedRef();

  const onScroll = useAnimatedScrollHandler<{x: number}>({
    onScroll: (e, ctx) => {
      ctx.x = e.contentOffset.x;
    },
    onEndDrag: (e, ctx) => {
      const points = photos.map((_, index) => (SIZE + 10) * index);
      const x = snapPoint(ctx.x, e.velocity?.x ?? 0, points);
      scrollTo(ref, x, 0, true);
    },
  });

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Contributors</Text>
      <AnimatedFlashList
        ref={ref}
        data={photos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={SIZE}
        onScroll={onScroll}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={() => {
          return (
            <View style={styles.plus}>
              <Icon name={'plus'} size={25} color={'#C5C8D7'} />
            </View>
          );
        }}
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
  title: {
    marginLeft: width * 0.05,
    fontFamily: 'UberBold',
    marginBottom: 5,
    color: '#000',
  },
  plus: {
    borderWidth: 1,
    borderColor: '#C5C8D7',
    borderStyle: 'dashed',
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  photo: {
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#3366ff',
  },
});

export default Contributors;
