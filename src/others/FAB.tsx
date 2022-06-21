import {
  View,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AnimatedButton, Folder} from '../utils/types';
import FABOption from './FABOption';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

type FABProps = {
  parent?: Folder;
};

const {width, height} = Dimensions.get('window');

const FAB_RADIUS = 25;
const RADIUS = width - FAB_RADIUS / 2;

const actions: AnimatedButton[] = [
  {
    icon: 'account',
    angle: Math.PI / 2,
  },
  {
    icon: 'camera',
    angle: (4 / 6) * Math.PI,
  },
  {
    icon: 'file',
    angle: (5 / 6) * Math.PI,
  },
  {
    icon: 'folder',
    angle: Math.PI,
  },
];

// const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const FAB: React.FC<FABProps> = ({}) => {
  const [blockBackInteraction, setBlockBackInteraction] =
    useState<boolean>(false);

  const progress = useSharedValue<number>(0);
  const buttonColor = useSharedValue<string>('#3366ff');
  const rotation = useSharedValue<number>(0);

  const rStyle = useAnimatedStyle(() => ({
    backgroundColor: buttonColor.value,
    transform: [{rotate: `${rotation.value}rad`}],
  }));

  const revert = () => {
    'worklet';
    progress.value = withTiming(0);
    buttonColor.value = withTiming('#3366ff');
    rotation.value = withTiming(0);

    runOnJS(setBlockBackInteraction)(!blockBackInteraction);
  };

  const tap = Gesture.Tap().onEnd(() => {
    if (blockBackInteraction) {
      revert();
    } else {
      progress.value = withTiming(1);
      buttonColor.value = withTiming('#b0b1b5');
      rotation.value = withTiming(Math.PI / 4);
    }

    runOnJS(setBlockBackInteraction)(!blockBackInteraction);
  });

  return (
    <View style={styles.root}>
      {blockBackInteraction && (
        <TouchableWithoutFeedback
          style={StyleSheet.absoluteFillObject}
          onPress={revert}>
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={styles.block}
          />
        </TouchableWithoutFeedback>
      )}
      <GestureDetector gesture={tap}>
        <Animated.View style={[styles.fab]}>
          {actions.map((action, index) => {
            return (
              <FABOption
                key={`action-${action.icon}`}
                action={{...action, index}}
                progress={progress}
              />
            );
          })}
          <Animated.View style={[rStyle, styles.icon]}>
            <Icon name={'plus'} size={30} color={'#fff'} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    height,
  },
  block: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  fab: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    height: FAB_RADIUS * 2,
    width: FAB_RADIUS * 2,
    borderRadius: FAB_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  icon: {
    height: FAB_RADIUS * 2,
    width: FAB_RADIUS * 2,
    borderRadius: FAB_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FAB;
