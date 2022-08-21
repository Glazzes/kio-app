import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import React from 'react';
import {Navigation} from 'react-native-navigation';
import {Screens} from '../../enums/screens';
import SearchBar from './SearchBar';
import {
  BlurMask,
  Canvas,
  Rect,
  useSharedValueEffect,
  useValue,
} from '@shopify/react-native-skia';
import Animated, {Extrapolate, interpolate} from 'react-native-reanimated';

type AppbarProps = {
  scrollY: Animated.SharedValue<number>;
  parentComponentId: string;
};

const {statusBarHeight} = Navigation.constantsSync();
const {width} = Dimensions.get('window');
const IMAGE_SIZE = 40;

const CANVAS_SIZE = 132;

const Appbar: React.FC<AppbarProps> = ({scrollY, parentComponentId}) => {
  const toProfile = () => {
    Navigation.push(parentComponentId, {
      component: {
        name: Screens.SETTINGS,
      },
    });
  };

  const opacity = useValue(0);

  useSharedValueEffect(() => {
    opacity.current = interpolate(
      scrollY.value,
      [0, 50],
      [0, 1],
      Extrapolate.CLAMP,
    );
  }, scrollY);

  return (
    <Animated.View style={styles.root}>
      <Canvas style={styles.canvas}>
        <Rect
          x={0}
          y={CANVAS_SIZE - 72}
          width={width}
          height={50}
          color={'#0b4199'}
          opacity={opacity}>
          <BlurMask blur={18} style={'normal'} />
        </Rect>
        <Rect x={0} y={0} width={width} height={CANVAS_SIZE} color={'#fff'} />
      </Canvas>
      <View style={styles.appbar}>
        <View>
          <Text style={styles.hi}>Hi,</Text>
          <Text style={styles.username}>Glaze</Text>
        </View>
        <Pressable onPress={toProfile}>
          <Image
            source={{
              uri: 'https://pettime.net/wp-content/uploads/2021/04/Dalmatian-2-10.jpg',
            }}
            style={styles.image}
            resizeMode={'cover'}
          />
        </Pressable>
      </View>
      <SearchBar />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: width,
    paddingTop: statusBarHeight + 5,
  },
  appbar: {
    width,
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  canvas: {
    position: 'absolute',
    height: CANVAS_SIZE + 25,
    width,
  },
  hi: {
    fontFamily: 'Uber',
    color: '#000',
  },
  username: {
    fontFamily: 'UberBold',
    fontSize: 17,
    color: '#000',
  },
  image: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
});

export default Appbar;
