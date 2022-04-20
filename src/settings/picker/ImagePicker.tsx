import {
  Dimensions,
  ListRenderItemInfo,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  cancelAnimation,
  Extrapolate,
  interpolate,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Navigation} from 'react-native-navigation';
import {clamp} from '../../utils/animations';
import {Box, Text} from 'native-base';
import {
  Asset,
  getAlbumsAsync,
  getAssetsAsync,
  MediaType,
} from 'expo-media-library';
import PickerPicture from './PickerPicture';
import {snapPoint} from 'react-native-redash';

type ImagePickerProps = {
  translateY: Animated.SharedValue<number>;
};

const getAssets = async (): Promise<Asset[]> => {
  const albums = await getAlbumsAsync();
  const assets: Asset[] = [];
  for (let album of albums) {
    const albumAssets = await getAssetsAsync({
      album: album.id,
      mediaType: MediaType.photo,
      first: 1000,
      sortBy: 'modificationTime',
    });

    assets.push(...albumAssets.assets);
  }

  assets.forEach(e => console.log(e.uri));
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
  return <PickerPicture asset={info.item} index={info.index} />;
}

const ImagePicker: React.FC<ImagePickerProps> = ({translateY}) => {
  const ref = useAnimatedRef<FlatList<Asset>>();
  const [assets, setAssets] = useState<Asset[]>([]);

  const offset = useSharedValue<number>(0);

  const translation = useDerivedValue<number>(() => {
    return clamp(-actualHeight, translateY.value, actualHeight);
  }, [translateY.value]);

  const scroll = useDerivedValue<number>(() => {
    return -1 * translateY.value - actualHeight;
  }, [translateY.value]);

  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.value = translateY.value;
      cancelAnimation(translateY);
      cancelAnimation(scroll);
    })
    .onChange(e => {
      translateY.value = offset.value + e.translationY;
    })
    .onEnd(({velocityY}) => {
      const contentHeight =
        Math.ceil(assets.length / 3) * (SIZE + PADDING * 2) + bottomTabsHeight;

      if (translateY.value <= -height / 2) {
        translateY.value = withDecay({
          velocity: velocityY,
          clamp: [-contentHeight, -height / 2],
        });
      } else {
        const snap = snapPoint(translateY.value, velocityY, [-height / 2, 0]);
        if (snap === -height / 2) {
          translateY.value = withDecay({
            velocity: velocityY,
            clamp: [-contentHeight, -height / 2],
          });
        } else {
          translateY.value = withTiming(0);
        }
      }
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
      scrollTo(ref, 0, value, false);
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
          removeClippedSubviews={true}
          windowSize={9}
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    height: height - bottomTabsHeight,
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
