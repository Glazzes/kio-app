/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, Dimensions, View} from 'react-native';
import React, {useCallback, useEffect, useMemo} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import AppHeader from './misc/AppHeader';
import {
  FlashList,
  FlashListProps,
  ListRenderItemInfo,
} from '@shopify/flash-list';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {File} from '../utils/types';
import Appbar from './misc/Appbar';
import {FAB} from '../misc';
import {Dimension} from '../shared/types';
import FileWrapper from './FileWrapper';
import {
  ImageThumbnail,
  PinchableReflection,
  VideoThumbnail,
} from './files/thumnnails';
import AudioThumbnail from './files/thumnnails/components/AudioThumbnail';
import {push, removeByComponentId} from '../store/navigationStore';
import PdfThumnail from './files/thumnnails/components/PdfThumnail';
import {NavigationProvider} from '../navigation/NavigationContext';

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

  const dimensions = useSharedValue<Dimension>({width: 1, height: 1});
  const translateX = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(0);
  const scale = useSharedValue<number>(1);
  const x = useSharedValue<number>(-windowHeight);
  const y = useSharedValue<number>(-windowHeight);

  const renderHeader = useCallback(() => {
    return <AppHeader />;
  }, []);

  const renderItem = useMemo(() => {
    return (info: ListRenderItemInfo<string>): React.ReactElement => {
      if (info.index === 0) {
        return (
          <FileWrapper index={info.index} parentComponentId={componentId}>
            <VideoThumbnail
              parentComponentId={componentId}
              index={info.index}
            />
          </FileWrapper>
        );
      }

      if (info.index === 2) {
        return (
          <FileWrapper index={info.index}>
            <PdfThumnail
              parentComponentId={componentId}
              thumbnail={
                'https://images-na.ssl-images-amazon.com/images/I/71X432GjWpL.jpg'
              }
            />
          </FileWrapper>
        );
      }

      return (
        <FileWrapper index={info.index}>
          {info.index % 2 === 0 ? (
            <AudioThumbnail
              parentComponentId={componentId}
              index={info.index}
            />
          ) : (
            <ImageThumbnail
              image={{} as File}
              pic={
                'https://images.unsplash.com/photo-1616567214738-22fc0c6332b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c2liZXJpYW4lMjBodXNreXxlbnwwfHwwfHw%3D&w=1000&q=80'
              }
              index={info.index}
              scale={scale}
              dimensions={dimensions}
              translateX={translateX}
              translateY={translateY}
              x={x}
              y={y}
            />
          )}
        </FileWrapper>
      );
    };
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });

  useEffect(() => {
    push({name: '', componentId});

    return () => {
      removeByComponentId(componentId);
    };
  }, []);

  return (
    <NavigationProvider componentId={componentId}>
      <View style={styles.root}>
        <Appbar scrollY={scrollY} />

        <AnimatedFlashList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
          nestedScrollEnabled={true}
          ListHeaderComponent={renderHeader}
          estimatedItemSize={data.length}
          estimatedListSize={{width: windowWidth, height: data.length * 65}}
          contentContainerStyle={styles.content}
          onScroll={onScroll}
        />

        <PinchableReflection
          dimensions={dimensions}
          translateX={translateX}
          translateY={translateY}
          scale={scale}
          x={x}
          y={y}
        />

        <FAB />
      </View>
    </NavigationProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    height: windowHeight,
    width: windowWidth,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  content: {
    paddingBottom: 50 + windowWidth * 0.05,
  },
});

Home.options = {
  statusBar: {
    visible: true,
    drawBehind: true,
    backgroundColor: '#fff',
    style: 'dark',
  },
  topBar: {
    visible: false,
  },
  sideMenu: {
    right: {
      enabled: true,
    },
  },
};

export default Home;
