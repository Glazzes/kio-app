import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';
import React from 'react';
import {
  Canvas,
  Circle,
  Fill,
  Group,
  LinearGradient,
  Mask,
  Paint,
  RoundedRect,
  useComputedValue,
  useLoop,
  useTiming,
  vec,
} from '@shopify/react-native-skia';
import FileSkeleton from '../home/misc/FileSkeleton';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {Modals} from '../navigation/screens/modals';

const SIZE = 120;

const h = 200 / (800 / 1280);
const angle = Math.PI / 9;
const a = 800 / 1280;

const x = 200 * Math.abs(Math.cos(angle)) + h * Math.abs(Math.sin(angle));
const y = 200 * Math.abs(Math.sin(angle)) + h * Math.abs(Math.cos(angle));

const {width} = Dimensions.get('window');

const Testing: NavigationFunctionComponent = ({componentId}) => {
  const timing = useTiming({from: -1, to: 1, loop: true}, {duration: 1500});

  const start = useComputedValue(() => vec(timing.current * 140, 0), [timing]);
  const end = useComputedValue(
    () => vec(140 * timing.current + 140, 0),
    [timing],
  );

  const pop = () => {
    Navigation.pop(componentId);
  };

  const openFileMenu = () => {
    Navigation.showModal({
      component: {
        name: Modals.FILE_MENU,
      },
    });
  };

  return (
    <Animated.View style={styles.root}>
      <View style={styles.container}>
        <Image
          source={{
            uri: 'https://static1.e621.net/data/79/30/7930b21a7348e57fa3e703a12e6f6eec.jpg',
          }}
          style={[styles.container, styles.abs, styles.image]}
        />
        <View style={[styles.abs, styles.border]} />
        <View style={[styles.tester]} />
      </View>
    </Animated.View>
  );
};

Testing.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

const size = Math.sin(angle) * 200 + Math.cos(angle) + 200 / a;
const space = (h * Math.tan(angle)) / 2;
const t = space * Math.sin(angle);
const h2 = t * Math.sin(angle);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 200,
    height: h,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'lime',
  },
  abs: {
    position: 'absolute',
  },
  image: {
    width: x,
    height: x / a,
    transform: [{rotate: `${angle}rad`}, {scale: 1}],
  },
  tester: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderColor: 'red',
    opacity: 0,
    borderWidth: 2,
    width: 200,
    height: space,
    transform: [
      {
        translateY: -space,
      },
      {translateX: t},
    ],
  },
  border: {
    width: 200,
    height: h,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'lime',
    transform: [{translateY: -space}, {translateX: t}],
  },
});

export default Testing;
