/* eslint-disable react-hooks/exhaustive-deps */
import {View, StyleSheet, Dimensions} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import AppHeader from './misc/AppHeader';
import {
  FlashList,
  ListRenderItemInfo,
  FlashListProps,
} from '@shopify/flash-list';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import ImageThumbnail from './files/thumnnails/ImageThumbnail';
import {File} from '../utils/types';
import Appbar from './misc/Appbar';
import {FAB} from '../misc';
import PinchableReflection from './files/thumnnails/PinchableReflection';
import {Dimension} from '../shared/types';

type HomeProps = {
  folderId?: string;
};

const data: string[] = ['h', 'i', 'z', 'a', 'f', 'y', 'g', 't'];

function keyExtractor(item: string): string {
  return item;
}

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<string>>(FlashList);

const Home: NavigationFunctionComponent<HomeProps> = ({componentId}) => {
  const scrollY = useSharedValue<number>(0);

  const isWider = useSharedValue<boolean>(false);
  const dimensions = useSharedValue<Dimension>({width: 1, height: 1});
  const translateX = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(0);
  const scale = useSharedValue<number>(1);
  const borderRadius = useSharedValue<number>(10);
  const x = useSharedValue<number>(-windowHeight);
  const y = useSharedValue<number>(-windowHeight);

  const renderHeader = useCallback(() => {
    return <AppHeader scrollY={scrollY} />;
  }, [scrollY]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const renderItem2 = useMemo(() => {
    return (info: ListRenderItemInfo<string>): React.ReactElement => {
      return (
        <ImageThumbnail
          isWider={isWider}
          index={info.index}
          pic={
            info.index % 2 === 0
              ? 'file:///storage/sdcard0/Descargas/glaceon.jpg'
              : 'file:///storage/sdcard0/Descargas/bigsur.jpg'
          }
          dimensions={dimensions}
          image={{} as File}
          translateX={translateX}
          translateY={translateY}
          scale={scale}
          rBorderRadius={borderRadius}
          x={x}
          y={y}
        />
      );
    };
  }, []);

  return (
    <View style={styles.root}>
      <Appbar parentComponentId={componentId} />

      <AnimatedFlashList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem2}
        numColumns={2}
        onScroll={onScroll}
        nestedScrollEnabled={true}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{padding: 10}}
        estimatedItemSize={data.length}
        estimatedListSize={{width: windowWidth, height: data.length * 65}}
      />

      <PinchableReflection
        isWider={isWider}
        dimensions={dimensions}
        translateX={translateX}
        translateY={translateY}
        scale={scale}
        borderRadius={borderRadius}
        x={x}
        y={y}
      />

      <FAB parentComponentId={componentId} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    width: windowWidth * 0.9,
  },
});

Home.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

export default Home;
