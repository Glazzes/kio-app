import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ViewStyle,
  ListRenderItemInfo,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import emitter from '../../../utils/emitter';
import {Event} from '../../../enums/events';
import {clamp} from '../../../utils/animations';

type PhotoPickerProps = {
  snap: Animated.SharedValue<boolean>;
  scrollY: Animated.SharedValue<number>;
  photos: string[];
};

type Photos = {[id: string]: string};

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

  const [selectedPhotos, setselectedPhotos] = useState<Photos>({});
  const [photoCount, setPhotoCount] = useState<number>(0);

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
        selected={selectedPhotos[info.item] !== undefined}
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

  useEffect(() => {
    const selectPhoto = emitter.addListener(
      Event.SELECT_PHOTO,
      (uri: string) => {
        setselectedPhotos(p => {
          p = {...p, [uri]: uri};
          setPhotoCount(Object.keys(p).length);
          return p;
        });
      },
    );

    const unselecPhoto = emitter.addListener(
      Event.UNSELECT_PHOTO,
      (uri: string) => {
        setselectedPhotos(p => {
          delete p[uri];
          setPhotoCount(Object.keys(p).length);
          return p;
        });
      },
    );

    return () => {
      selectPhoto.remove();
      unselecPhoto.remove();
    };
  }, []);

  useAnimatedReaction(
    () => scroll.value,
    y => {
      scrollTo(ref, 0, y, false);
    },
  );

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.root, rStyle]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {photoCount > 0
              ? `${photoCount} selected pictures`
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
    backgroundColor: 'salmon',
    elevation: -1,
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
    overflow: 'hidden',
  },
  header: {
    width,
    height: statusBarHeight * 1.5,
    justifyContent: 'center',
    paddingHorizontal: PADDING,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
  },
});

export default PhotoPicker;
