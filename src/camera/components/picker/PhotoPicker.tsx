import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ViewStyle,
  ListRenderItemInfo,
  FlatList,
} from 'react-native';
import React from 'react';
import Animated, {
  cancelAnimation,
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
import {snapPoint} from 'react-native-redash';
import {Navigation} from 'react-native-navigation';
import PickerPhoto from './PickerPhoto';
import {Canvas, RoundedRect, Shadow} from '@shopify/react-native-skia';
import {useSnapshot} from 'valtio';
import {pictureSelectionState} from '../../../store/photoStore';
import {clamp} from '../../../shared/functions/animations/clamp';

type PhotoPickerProps = {
  snap: Animated.SharedValue<boolean>;
  scrollY: Animated.SharedValue<number>;
  photos: string[];
};

const {width, height} = Dimensions.get('window');
const {statusBarHeight} = Navigation.constantsSync();

const COL = 3;
const RADIUS = 20;
const PADDING = 10;
const PHOTO_SIZE = width / 3 + PADDING * 2;
const CONTAINER_HEIGHT = height - statusBarHeight * 1.5;

function keyExtractor(path: string) {
  return `photo-${path}`;
}

const PhotoPicker: React.FC<PhotoPickerProps> = ({scrollY, photos, snap}) => {
  const ref = useAnimatedRef<FlatList<string>>();

  const selectedPictures = useSnapshot(pictureSelectionState.selectedPictures);
  const selectedPicturesCount = Object.keys(selectedPictures).length;

  const contentStyles: ViewStyle = {
    width,
    height: Math.max(
      CONTAINER_HEIGHT,
      (Math.floor(photos.length / 3) + 1) * PHOTO_SIZE,
    ),
  };

  const renderItem = function (
    info: ListRenderItemInfo<string>,
  ): React.ReactElement {
    return (
      <PickerPhoto
        uri={info.item}
        selected={selectedPictures[info.item] !== undefined}
      />
    );
  };

  const translation = useDerivedValue<number>(() => {
    return clamp(scrollY.value, -height, 0);
  }, [scrollY]);

  const scroll = useDerivedValue<number>(() => {
    return -1 * scrollY.value - height;
  }, [scrollY]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translation.value}],
    };
  });

  const offset = useSharedValue<number>(0);
  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.value = scrollY.value;
      cancelAnimation(scrollY);
    })
    .onChange(e => {
      scrollY.value = offset.value + e.translationY;
    })
    .onEnd(e => {
      const contentHeight =
        Math.ceil(photos.length / 3 + 1) * PHOTO_SIZE + statusBarHeight;

      const threshold = Math.min(-contentHeight, -height);

      const snapScroll = snapPoint(scrollY.value, e.velocityY, [-height, 0]);
      if (snapScroll === 0 && scrollY.value > -height / 2) {
        scrollY.value = withTiming(snapScroll);
        snap.value = true;
      } else {
        scrollY.value = withDecay({
          velocity: e.velocityY,
          clamp: [threshold, -height / 2],
        });
      }
    });

  useAnimatedReaction(
    () => scroll.value,
    y => {
      scrollTo(ref, 0, y, false);
    },
  );

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.root, rStyle]}>
        <Canvas style={styles.canvas}>
          <RoundedRect
            x={0}
            y={statusBarHeight * 2}
            width={width}
            height={height}
            r={RADIUS}
            color={'#fff'}>
            <Shadow dx={0} dy={-5} blur={10} color={'rgba(0, 0, 0, 0.1)'} />
          </RoundedRect>
        </Canvas>
        <View style={styles.marker} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {selectedPicturesCount > 0
              ? `${selectedPicturesCount} selected picture${
                  selectedPicturesCount > 1 ? 's' : ''
                }`
              : 'Upload photos'}
          </Text>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            ref={ref}
            data={photos}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={COL}
            contentContainerStyle={contentStyles}
            scrollEnabled={false}
          />
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    height,
    position: 'absolute',
    top: height,
    backgroundColor: '#fff',
    elevation: -1,
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
  },
  canvas: {
    position: 'absolute',
    width,
    height: height + statusBarHeight * 2,
    transform: [{translateY: -statusBarHeight * 2}],
  },
  header: {
    width,
    justifyContent: 'center',
    paddingHorizontal: PADDING,
  },
  marker: {
    backgroundColor: '#2C3639',
    height: 5,
    width: width * 0.25,
    borderRadius: 15,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
  },
});

export default React.memo(PhotoPicker);
