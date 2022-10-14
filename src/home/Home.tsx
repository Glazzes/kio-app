/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, Dimensions, View} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import AppHeader from './misc/header/AppHeader';
import {
  FlashList,
  FlashListProps,
  ListRenderItemInfo,
} from '@shopify/flash-list';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Appbar from './misc/header/Appbar';
import FAB from './misc/filefab/FAB';
import {Dimension, File} from '../shared/types';
import FileWrapper from './files/thumnnails/components/FileWrapper';
import {
  ImageThumbnail,
  PinchableReflection,
  VideoThumbnail,
} from './files/thumnnails';
import AudioThumbnail from './files/thumnnails/components/AudioThumbnail';
import {push, removeByComponentId} from '../store/navigationStore';
import PdfThumnail from './files/thumnnails/components/PdfThumnail';
import {NavigationContextProvider} from '../navigation';
import NoContent from './misc/NoContent';
import GenericThumbnail from './files/thumnnails/components/GenericThumbnail';
import {getSimpleMimeType} from '../shared/functions/getMimeType';
import {MimeType} from '../shared/enum/MimeType';

type HomeProps = {
  folderId?: string;
};

const data: string[] = ['h']; // ['h', 'i', 'a', 'b', 'c', 'd', 'e', 'f'];

const files: File[] = [
  {
    id: '1',
    name: 'Husky.png',
    size: 2.359 * 1024 * 1024,
    mimeType: 'image/png',
    isFavorite: true,
  },
  {
    id: '5',
    name: 'Docker in action.pdf',
    size: 856000,
    mimeType: 'application/pdf',
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Call your name.mp3',
    size: 13 * 1024 * 1024,
    mimeType: 'audio/mp3',
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Randoooom.mp4',
    size: 856000,
    mimeType: 'video/mp4',
    isFavorite: false,
  },
  {
    id: '4',
    name: 'One.psd',
    size: 856000,
    mimeType: 'application/json',
    isFavorite: false,
  },
];

function keyExtractor(item: File): string {
  return item.id;
}

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');
const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<File>>(FlashList);

const Home: NavigationFunctionComponent<HomeProps> = ({
  componentId,
  folderId,
}) => {
  const ref = useRef<typeof AnimatedFlashList>(null);

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

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const renderItem = useCallback((info: ListRenderItemInfo<File>) => {
    const mimeType = getSimpleMimeType(info.item.mimeType);

    const defineComponent = () => {
      switch (mimeType) {
        case MimeType.IMAGE:
          return (
            <ImageThumbnail
              file={info.item}
              pic={
                'https://images.unsplash.com/photo-1616567214738-22fc0c6332b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c2liZXJpYW4lMjBodXNreXxlbnwwfHwwfHw%3D&w=1000&q=80'
              }
              dimensions={dimensions}
              translateX={translateX}
              translateY={translateY}
              x={x}
              y={y}
              scale={scale}
            />
          );

        case MimeType.AUDIO:
          return <AudioThumbnail index={info.index} />;

        case MimeType.VIDEO:
          return <VideoThumbnail index={info.index} file={info.item} />;

        case MimeType.PDF:
          return (
            <PdfThumnail thumbnail="https://images.manning.com/book/9/9a102d1-8e4d-4f20-a095-c60ca54fc5e6/Nickoloff-Docker-2ed-RGB.jpg" />
          );

        default:
          return <GenericThumbnail mimeType="image" />;
      }
    };

    return (
      <FileWrapper index={info.index} file={info.item}>
        {defineComponent()}
      </FileWrapper>
    );
  }, []);

  useEffect(() => {
    push({name: '', componentId});

    Navigation.showModal({
      component: {
        name: 'M',
      },
    });

    return () => {
      removeByComponentId(componentId);
    };
  }, []);

  return (
    <NavigationContextProvider componentId={componentId}>
      <View style={styles.root}>
        <Appbar scrollY={scrollY} folderId={folderId} />

        <AnimatedFlashList
          ref={ref as any}
          data={files}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
          nestedScrollEnabled={true}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={NoContent}
          estimatedItemSize={Math.max(1, data.length)}
          estimatedListSize={{width: windowWidth, height: data.length * 65}}
          contentContainerStyle={styles.content}
          onScroll={onScroll}
        />

        <FAB />

        <PinchableReflection
          dimensions={dimensions}
          translateX={translateX}
          translateY={translateY}
          scale={scale}
          x={x}
          y={y}
        />
      </View>
    </NavigationContextProvider>
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
  layout: {
    backgroundColor: 'transparent',
    componentBackgroundColor: 'transparent',
  },
};

export default Home;
