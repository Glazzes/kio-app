import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
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

const {width} = Dimensions.get('window');
const {statusBarHeight} = Navigation.constantsSync();

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
      <View style={styles.appbar}>
        <Pressable hitSlop={20} onPress={pop}>
          <Icon name={'ios-arrow-back'} size={22} color={'#000'} />
        </Pressable>
        <Pressable hitSlop={20} onPress={openFileMenu}>
          <Icon name={'ios-ellipsis-vertical'} size={22} color={'#000'} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <Icon name={'ios-document'} size={120} color={'#3366ff'} />
        <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
          Glaceon.png
        </Text>
        <Text style={styles.size}>5Mb</Text>

        <Text style={styles.message}>
          We don't support this format for file pre visualization, read about it{' '}
          <Text style={styles.link}>here</Text>
        </Text>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Download</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

Testing.options = {
  statusBar: {
    visible: true,
    drawBehind: true,
    backgroundColor: '#fff',
    style: 'dark',
  },
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
  },
  appbar: {
    width: width * 0.9,
    height: statusBarHeight * 3,
    paddingTop: statusBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
    fontSize: 20,
  },
  size: {
    fontFamily: 'UberBold',
    color: '#000',
    marginBottom: 20,
  },
  message: {
    fontFamily: 'UberBold',
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    fontFamily: 'UberBold',
    color: '#3366ff',
  },
  button: {
    width: width * 0.9,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#3366ff',
  },
  buttonText: {
    fontFamily: 'UberBold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default Testing;