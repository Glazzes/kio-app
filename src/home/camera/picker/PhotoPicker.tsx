import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ViewStyle,
  ListRenderItemInfo,
} from 'react-native';
import React, {useRef} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {snapPoint} from 'react-native-redash';
import {Navigation} from 'react-native-navigation';
import PickerPhoto from './PickerPhoto';

type PhotoPickerProps = {
  opacity: Animated.SharedValue<number>;
  scrollY: Animated.SharedValue<number>;
  photos: string[];
};

const {width, height} = Dimensions.get('window');
const {statusBarHeight} = Navigation.constantsSync();

const COL = 3;
const RADIUS = 20;
const PADDING = 10;
const PHOTO_SIZE = width - PADDING * 5;
const BASE_CONTENT_HEIGHT = height - statusBarHeight * 1.5;

function keyExtractor(path: string) {
  return `photo-${path}`;
}

function renderItem(info: ListRenderItemInfo<string>): React.ReactElement {
  return <PickerPhoto uri={info.item} />;
}

const PhotoPicker: React.FC<PhotoPickerProps> = ({
  scrollY,
  opacity,
  photos,
}) => {
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: scrollY.value}],
    };
  });

  const contentStyles = useRef<ViewStyle>({
    width,
    height: Math.max(BASE_CONTENT_HEIGHT, (photos.length / 3 + 2) * PHOTO_SIZE),
  }).current;

  const offset = useSharedValue<number>(0);
  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.value = scrollY.value;
    })
    .onChange(e => {
      scrollY.value = offset.value + e.translationY;
    })
    .onEnd(e => {
      const snap = snapPoint(scrollY.value, e.velocityY, [0, -height]);
      if (snap === 0) {
        scrollY.value = withTiming(snap);
        opacity.value = withTiming(1);
      }
    });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.root, rStyle]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Upload photos</Text>
        </View>
        <View style={styles.listContainer}>
          <Animated.FlatList
            data={photos}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={COL}
            contentContainerStyle={contentStyles}
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
