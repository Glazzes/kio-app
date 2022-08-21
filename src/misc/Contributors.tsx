import {View, StyleSheet, Dimensions, Text, Image} from 'react-native';
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
import {
  Canvas,
  Circle,
  LinearGradient,
  Paint,
  vec,
} from '@shopify/react-native-skia';

type ContributorsProps = {};

const {width} = Dimensions.get('window');

const photos = [
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/women/21.jpg',
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/men/81.jpg',
  'https://randomuser.me/api/portraits/men/68.jpg',
];

const STROKE_WIDTH = 1.5;
const SIZE = 45 - STROKE_WIDTH * 2.5;
const CANVAS_SIZE = 50;

const gradients = [
  ['#223843', '#d77a61'],
  ['#ffb600', '#F69A97'],
  ['#d9ed92', '#184e77'],
];

const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<string>>(FlashList);

function keyExtractor(item: string, index: number): string {
  return `${item}-${index}`;
}

function renderItem(info: ListRenderItemInfo<string>) {
  return (
    <View style={styles.photoContainer}>
      <Canvas style={styles.canvas}>
        <Circle
          r={CANVAS_SIZE / 2 - STROKE_WIDTH}
          cx={CANVAS_SIZE / 2}
          cy={CANVAS_SIZE / 2}
          color={'transparent'}>
          <Paint style={'stroke'} strokeWidth={STROKE_WIDTH}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(CANVAS_SIZE, CANVAS_SIZE)}
              colors={gradients[info.index % gradients.length]}
            />
          </Paint>
        </Circle>
      </Canvas>
      <Image source={{uri: info.item}} style={styles.photo} />
    </View>
  );
}

function separatorComponent() {
  return <View style={styles.separator} />;
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
      <Text style={styles.title}>Co-owners</Text>
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
        ItemSeparatorComponent={separatorComponent}
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
  separator: {
    width: 10,
  },
  root: {
    width,
    marginBottom: 15,
  },
  content: {
    paddingHorizontal: width * 0.05,
  },
  title: {
    marginLeft: width * 0.05,
    fontFamily: 'UberBold',
    fontSize: 15,
    color: '#000',
    marginBottom: 10,
  },
  plus: {
    borderWidth: 1,
    borderColor: '#C5C8D7',
    borderStyle: 'dashed',
    height: CANVAS_SIZE,
    width: CANVAS_SIZE,
    borderRadius: CANVAS_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  photoContainer: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    position: 'absolute',
  },
  photo: {
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
  },
});

export default Contributors;
