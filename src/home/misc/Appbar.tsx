import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Navigation} from 'react-native-navigation';
import SearchBar from './SearchBar';
import {
  BlurMask,
  Canvas,
  Rect,
  useSharedValueEffect,
  useValue,
} from '@shopify/react-native-skia';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import emitter from '../../utils/emitter';
import Icon from 'react-native-vector-icons/Ionicons';
import {Context} from '../../navigation/NavigationContext';
import UserAvatar from './UserAvatar';
import {SelectAction} from '../utils/enums';

type AppbarProps = {
  scrollY: Animated.SharedValue<number>;
};

const {statusBarHeight} = Navigation.constantsSync();
const {width} = Dimensions.get('window');
const IMAGE_SIZE = 40;

const CANVAS_SIZE = statusBarHeight * 3 + 60;

const Appbar: React.FC<AppbarProps> = ({scrollY}) => {
  const componentId = useContext(Context);

  const [files, setFiles] = useState<string[]>([]);

  const clear = () => {
    setFiles([]);
    emitter.emit('unselect-file');
  };

  const opacity = useValue(0);
  const translateY = useSharedValue<number>(0);

  const rStyle = useAnimatedStyle(() => {
    return {transform: [{translateY: translateY.value}]};
  });

  useSharedValueEffect(() => {
    opacity.current = interpolate(
      scrollY.value,
      [0, 50],
      [0, 1],
      Extrapolate.CLAMP,
    );
  }, scrollY);

  useAnimatedReaction(
    () => files.length,
    value => {
      translateY.value = withTiming(value > 0 ? -statusBarHeight * 2 : 0);
    },
  );

  useEffect(() => {
    const selectFile = emitter.addListener(
      `${SelectAction.SELECT_FILE}-${componentId}`,
      (item: string) => {
        setFiles(f => [...f, item]);
      },
    );

    const unselectFile = emitter.addListener(
      `${SelectAction.UNSELECT_FILE}-${componentId}`,
      (id: string) => {
        setFiles(f => f.filter(file => file !== id));
      },
    );

    const clearSelection = emitter.addListener(
      `${SelectAction.UNSELECT_ALL}-${componentId}`,
      clear,
    );

    return () => {
      selectFile.remove();
      unselectFile.remove();
      clearSelection.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <View style={styles.appbarContainer}>
        <Animated.View style={rStyle}>
          <View style={styles.appbar}>
            <View>
              <Text style={styles.hi}>Hi,</Text>
              <Text style={styles.username}>Glaze</Text>
            </View>
            <UserAvatar />
          </View>
          <View style={styles.appbar}>
            <View style={styles.countContainer}>
              <Pressable onPress={clear} hitSlop={20}>
                <Icon name={'close'} size={23} color={'#000'} />
              </Pressable>
              <Text style={styles.count}>{files.length}</Text>
            </View>
            <View style={styles.countContainer}>
              <Icon
                name={'ios-copy-outline'}
                size={23}
                color={'#000'}
                style={styles.icon}
              />
              <Icon
                name={'ios-cut'}
                size={23}
                color={'#000'}
                style={styles.icon}
              />
              <Icon
                name={'ios-cloud-download'}
                size={23}
                color={'#000'}
                style={styles.icon}
              />
              <Icon
                name={'ios-trash-outline'}
                size={23}
                color={'#ee3060'}
                style={styles.icon}
              />
            </View>
          </View>
        </Animated.View>
      </View>

      <SearchBar />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: width,
    paddingTop: statusBarHeight,
  },
  appbarContainer: {
    height: statusBarHeight * 2,
    overflow: 'hidden',
  },
  appbar: {
    width,
    paddingHorizontal: width * 0.05,
    height: statusBarHeight * 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  indicator: {
    height: 12,
    width: 12,
    borderRadius: 5,
    backgroundColor: '#3366ff',
    borderColor: '#fff',
    borderWidth: 1,
    position: 'absolute',
    top: IMAGE_SIZE / 2 - 6 + (IMAGE_SIZE / 2) * -Math.sin(Math.PI / 4),
    left: IMAGE_SIZE / 2 - 6 + (IMAGE_SIZE / 2) * Math.cos(Math.PI / 4),
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    fontFamily: 'UberBold',
    color: '#000',
    fontSize: 17,
    marginLeft: 20,
  },
  icon: {
    marginLeft: 15,
  },
});

export default Appbar;
