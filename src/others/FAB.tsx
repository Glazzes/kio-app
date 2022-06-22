import {View, Dimensions, StyleSheet, Pressable} from 'react-native';
import React, {useState} from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AnimatedButton, Folder} from '../utils/types';
import FABOption from './FABOption';

type FABProps = {
  parent?: Folder;
};

const {width, height} = Dimensions.get('window');

const FAB_RADIUS = 25;

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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

  const toggle = () => {
    // console.log('Remove this console log and it will break');
    if (blockBackInteraction) {
      progress.value = withTiming(0);
      buttonColor.value = withTiming('#3366ff');
      rotation.value = withTiming(0);
      setBlockBackInteraction(false);
    } else {
      progress.value = withTiming(1);
      buttonColor.value = withTiming('#b0b1b5');
      rotation.value = withTiming(Math.PI / 4);
      setBlockBackInteraction(true);
    }
  };

  return (
    <View style={styles.root}>
      {blockBackInteraction && (
        <AnimatedPressable
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={[StyleSheet.absoluteFillObject, styles.block]}
          onPress={toggle}
        />
      )}
      <AnimatedPressable style={[styles.fab]} onPress={toggle}>
        {actions.map(action => {
          return (
            <FABOption
              key={`action-${action.icon}`}
              action={action}
              progress={progress}
              toggle={toggle}
            />
          );
        })}
        <Animated.View style={[rStyle, styles.icon]}>
          <Icon name={'plus'} size={30} color={'#fff'} />
        </Animated.View>
      </AnimatedPressable>
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
