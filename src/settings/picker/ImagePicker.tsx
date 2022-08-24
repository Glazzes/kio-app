import {
  Dimensions,
  ListRenderItemInfo,
  StyleSheet,
  FlatList,
  Alert,
  View,
  Text,
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
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Navigation} from 'react-native-navigation';
import {clamp} from '../../utils/animations';
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
    scrollTo(ref, 0, -1 * translateY.value - height, false);
  }, [translateY]);

  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.value = translateY.value;
      cancelAnimation(translateY);
    })
    .onUpdate(e => {
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

        return;
      }

      const snap = snapPoint(translateY.value, velocityY, [-height / 2, 0]);
      if (snap === -height / 2) {
        if (velocityY > 0 && velocityY < 100) {
          translateY.value = withSpring(snap);
          return;
        }

        translateY.value = withDecay({
          velocity: velocityY,
          clamp: [-contentHeight, snap],
        });
        return;
      }

      translateY.value = withTiming(0);
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

  const placeHolderStyles = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width,
      height,
      backgroundColor:
        translateY.value !== 0
          ? withTiming('rgba(0, 0, 0, 0.2)')
          : withTiming('transparent'),
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
    <View style={styles.rootContainer}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.root, rStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>Select a picture</Text>
          </View>
          <FlatList
            ref={ref}
            data={assets}
            numColumns={COL}
            scrollEnabled={false}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
            contentContainerStyle={styles.content}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    position: 'absolute',
    width,
    height,
  },
  root: {
    position: 'absolute',
    top: height,
    width,
    height: height - statusBarHeight,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    width,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
  },
  content: {
    width,
    backgroundColor: '#fff',
  },
});

export default ImagePicker;
