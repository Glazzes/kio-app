import {
  Dimensions,
  ListRenderItemInfo,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  cancelAnimation,
  Extrapolate,
  interpolate,
  scrollTo,
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
  requestPermissionsAsync,
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

  return assets;
};

const {statusBarHeight} = Navigation.constantsSync();
const {width, height} = Dimensions.get('window');

const COL = 3;
const PADDING = 5;
const SIZE = width / 3;
const actualHeight = height - statusBarHeight;

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
  const [assets, setAssets] = useState<Asset[]>([{} as Asset]);

  const offset = useSharedValue<number>(0);

  const translation = useDerivedValue<number>(() => {
    return clamp(translateY.value, -actualHeight, actualHeight);
  }, [translateY.value]);

  useDerivedValue(() => {
    scrollTo(ref, 0, -1 * translateY.value - actualHeight, false);
  }, [translateY.value]);

  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.value = translateY.value;
      cancelAnimation(translateY);
    })
    .onChange(e => {
      translateY.value = offset.value + e.translationY;
    })
    .onEnd(({velocityY}) => {
      const contentHeight =
        Math.ceil(assets.length / 3) * (SIZE + PADDING * 2) + statusBarHeight;

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
      const {granted} = await requestPermissionsAsync();
      if (granted) {
        const allAssets = await getAssets();
        setAssets(allAssets);
      } else {
        Alert.alert('Error xd');
      }
    })();
  }, []);

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
          removeClippedSubviews={false}
          contentContainerStyle={styles.content}
          windowSize={9}
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    height: height - statusBarHeight,
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
