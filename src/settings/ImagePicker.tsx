import {
  Dimensions,
  ListRenderItemInfo,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Navigation} from 'react-native-navigation';
import {clamp} from '../utils/animations';
import {Box, Text} from 'native-base';
import {
  Asset,
  getAlbumsAsync,
  getAssetsAsync,
  MediaType,
} from 'expo-media-library';
import PickerPicture from './picker/PickerPicture';

type ImagePickerProps = {
  translateY: Animated.SharedValue<number>;
};

const getAssets = async (): Promise<Asset[]> => {
  const albums = await getAlbumsAsync();
  const assets: Asset[] = [{} as Asset];
  for (let album of albums) {
    const albumAssets = await getAssetsAsync({
      album: album.id,
      mediaType: MediaType.photo,
      first: 999_999_999,
    });

    assets.push(...albumAssets.assets);
  }

  return assets;
};

const {bottomTabsHeight} = Navigation.constantsSync();
const {width, height} = Dimensions.get('window');

const COL = 3;
const PADDING = 5;
const SIZE = width / COL - PADDING * 2;
const actualHeight = height - bottomTabsHeight;

function getItemLayout(
  _: any,
  index: number,
): {offset: number; length: number; index: number} {
  return {
    index,
    offset: SIZE * Math.floor(index / COL),
    length: SIZE,
  };
}

function keyExtractor(asset: Asset, _: number): string {
  return `tile-${asset.uri}`;
}

function renderItem(info: ListRenderItemInfo<Asset>): React.ReactElement {
  return <PickerPicture uri={info.item.uri} index={info.index} />;
}

const ImagePicker: React.FC<ImagePickerProps> = ({translateY}) => {
  const ref = useAnimatedRef<FlatList<Asset>>();
  const [assets, setAssets] = useState<Asset[]>([]);

  const offset = useSharedValue<number>(0);

  const translation = useDerivedValue<number>(() => {
    return clamp(-actualHeight, translateY.value, actualHeight);
  }, [translateY.value]);

  const scroll = useDerivedValue<number>(() => {
    const contentHeight = Math.ceil(assets.length / 3) * (SIZE + PADDING * 2);
    const sy = -1 * translateY.value - actualHeight;
    const contentOffset = contentHeight - actualHeight;

    return clamp(0, sy, contentOffset);
  }, [translateY.value]);

  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.value = translateY.value;
    })
    .onChange(e => {
      translateY.value = offset.value + e.translationY;
    })
    .onEnd(({velocityY}) => {
      const contentHeight = Math.ceil(assets.length / 3) * (SIZE + PADDING * 2);

      translateY.value = withDecay({
        velocity: velocityY,
        clamp: [-contentHeight, 0],
      });
    });

  const rStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translation.value,
      [actualHeight * 0.75, actualHeight],
      [20, 0],
      Extrapolate.CLAMP,
    );

    return {
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      transform: [{translateY: translation.value}],
    };
  });

  useEffect(() => {
    (async () => {
      const allAssets = await getAssets();
      setAssets(allAssets);
    })();
  }, []);

  useAnimatedReaction(
    () => scroll.value,
    value => {
      scrollTo(ref, 0, value, true);
    },
  );

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.root, rStyle]}>
        <Box width={width} px={4} py={2.5}>
          <Text fontWeight={'bold'}>Select a picture</Text>
        </Box>
        <FlatList
          ref={ref}
          data={assets}
          numColumns={COL}
          scrollEnabled={false}
          initialNumToRender={24}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    height,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  content: {
    width,
    backgroundColor: '#fff',
  },
});

export default ImagePicker;
