import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Pressable,
  FlatList,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {
  FlashList,
  FlashListProps,
  ListRenderItemInfo,
} from '@shopify/flash-list';
import Contributor from './Contributor';
import {User} from '../types';
import {NavigationContext} from '../../navigation/components/NavigationContextProvider';
import {Navigation} from 'react-native-navigation';
import {Modals} from '../../navigation/screens/modals';
import emitter, {getAddContributorsEventName} from '../emitter';

type ContributorsProps = {
  coowners: User[];
};

const {width} = Dimensions.get('window');

const STROKE_WIDTH = 1.5;
const SIZE = 45 - STROKE_WIDTH * 2.5;
const CANVAS_SIZE = 50;

const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<User>>(FlashList);

function keyExtractor(item: User, index: number): string {
  return `${item.id}-${index}`;
}

function renderItem(info: ListRenderItemInfo<User>) {
  return <Contributor user={info.item} index={info.index} imageUrl={''} />;
}

function separatorComponent() {
  return <View style={styles.separator} />;
}

const Contributors: React.FC<ContributorsProps> = ({
  coowners: startCoowners,
}) => {
  const ref = useAnimatedRef<FlatList<User>>();
  const {folder} = useContext(NavigationContext);

  const [coowners, setCoowners] = useState<User[]>(startCoowners);

  const openShareModal = () => {
    Navigation.showModal({
      component: {
        name: Modals.SHARE,
        passProps: {
          folder,
        },
      },
    });
  };

  const onScroll = useAnimatedScrollHandler<{x: number}>({
    onScroll: (e, ctx) => {
      ctx.x = e.contentOffset.x;
    },
  });

  const addCoowners = (users: User[]) => {
    setCoowners(c => [...c, ...users]);
  };

  useEffect(() => {
    const addContributorsFromParentEventName = getAddContributorsEventName(
      folder?.id ?? '',
    );
    const addContributorsFromParentListener = emitter.addListener(
      addContributorsFromParentEventName,
      addCoowners,
    );

    return () => {
      addContributorsFromParentListener.remove();
    };
  }, [folder?.id]);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Co-owners</Text>
      <AnimatedFlashList
        ref={ref as any}
        data={coowners}
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
            <Pressable
              onPress={openShareModal}
              style={({pressed}) => {
                return {...styles.plus, opacity: pressed ? 0.5 : 1};
              }}>
              <Icon name={'plus'} size={25} color={'#C5C8D7'} />
            </Pressable>
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
    fontSize: 14,
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
    marginRight: 10,
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
