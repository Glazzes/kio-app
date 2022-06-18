import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ViewStyle,
  ListRenderItemInfo,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Animated, {
  cancelAnimation,
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
const PHOTO_SIZE = width - PADDING * 5;
const CONTAINER_HEIGHT = height - statusBarHeight * 1.5;

function keyExtractor(path: string) {
  return `photo-${path}`;
}

function renderItem(info: ListRenderItemInfo<string>): React.ReactElement {
  return <PickerPhoto uri={info.item} />;
}

const PhotoPicker: React.FC<PhotoPickerProps> = ({scrollY, photos, snap}) => {
  const [selectedPhotos, setselectedPhotos] = useState<string[]>([]);

  const scroll = useDerivedValue<number>(() => {
    return Math.max(scrollY.value, -height);
  }, [scrollY]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: scroll.value}],
    };
  });

  const contentStyles = useRef<ViewStyle>({
    width,
    height: Math.max(
      CONTAINER_HEIGHT,
      (Math.floor(photos.length / 3) + 2) * PHOTO_SIZE,
    ),
  }).current;

  const offset = useSharedValue<number>(0);
  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.value = scroll.value;
      cancelAnimation(scrollY);
    })
    .onChange(e => {
      scrollY.value = offset.value + e.translationY;
    })
    .onEnd(e => {
      const snapScroll = snapPoint(scrollY.value, e.velocityY, [-height, 0]);
      if (snapScroll === 0 && scrollY.value > -height / 2) {
        scrollY.value = withTiming(snapScroll);
        snap.value = true;
      } else {
        scrollY.value = withDecay({
          velocity: e.velocityY,
          clamp: [-height, -height / 2],
        });
      }
    });

  useEffect(() => {
    const selectPhoto = emitter.addListener(
      Event.SELECT_PHOTO,
      (uri: string) => {
        setselectedPhotos(p => [uri, ...p]);
      },
    );

    const unselecPhoto = emitter.addListener(
      Event.UNSELECT_PHOTO,
      (uri: string) => {
        setselectedPhotos(p => p.filter(i => i !== uri));
      },
    );

    return () => {
      selectPhoto.remove();
      unselecPhoto.remove();
    };
  }, []);

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.root, rStyle]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {selectedPhotos.length > 0
              ? `${selectedPhotos.length} selected pictures`
              : 'Upload photos'}
          </Text>
        </View>
        <View style={styles.listContainer}>
          <Animated.FlatList
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
