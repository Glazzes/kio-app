import {View, StyleSheet, Dimensions, Image} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {snapPoint} from 'react-native-redash';

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

const Contributors: React.FC<ContributorsProps> = ({}) => {
  const ref = useAnimatedRef<Animated.ScrollView>();

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
    <View style={{width, marginBottom: 10}}>
      <Animated.ScrollView
        ref={ref}
        onScroll={onScroll}
        contentContainerStyle={styles.content}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.plus}>
          <Icon name={'plus'} size={25} color={'#C5C8D7'} />
        </View>
        {photos.map((uri, index) => {
          return (
            <Image
              source={{uri}}
              style={styles.photo}
              key={`photo-${uri}-${index}`}
            />
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: width * 0.05,
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
