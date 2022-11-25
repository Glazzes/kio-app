import {Dimensions, StyleSheet, Pressable, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Folder} from '../../../utils/types';
import FABOption from './FABOption';
import emitter from '../../../utils/emitter';
import {Event} from '../../../enums/events';
import {FabAction} from './types';
import {NavigationContext} from '../../../navigation/NavigationContextProvider';
import {SelectAction} from '../../utils/enums';

type FABProps = {
  parent?: Folder;
};

const {width, height} = Dimensions.get('window');

const FAB_RADIUS = 25;

const actions: FabAction[] = [
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

const FAB: React.FC<FABProps> = () => {
  const {componentId} = useContext(NavigationContext);

  const [blockBackInteraction, setBlockBackInteraction] =
    useState<boolean>(false);

  const progress = useSharedValue<number>(0);
  const buttonColor = useSharedValue<string>('#3366ff');
  const rotation = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(0);

  const rStyle = useAnimatedStyle(() => ({
    backgroundColor: buttonColor.value,
    transform: [{rotate: `${rotation.value}rad`}],
  }));

  const fabStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const toggle = () => {
    if (blockBackInteraction) {
      progress.value = withTiming(0);
      buttonColor.value = withTiming('#3366ff');
      rotation.value = withTiming(0);
      setBlockBackInteraction(false);
    } else {
      emitter.emit(`${SelectAction.UNSELECT_ALL}-${componentId}`);

      progress.value = withSpring(1);
      buttonColor.value = withTiming('#b0b1b5');
      rotation.value = withTiming(Math.PI / 4);
      setBlockBackInteraction(true);
    }
  };

  useEffect(() => {
    const moveUp = emitter.addListener(Event.FAB_MOVE_UP, (ty: number) => {
      translateY.value = withTiming(-ty, {duration: 150});
    });

    const moveDown = emitter.addListener(Event.FAB_MOVE_DOWN, () => {
      translateY.value = withTiming(0);
    });

    return () => {
      moveUp.remove();
      moveDown.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <AnimatedPressable style={[styles.fab, fabStyle]} onPress={toggle}>
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
    position: 'absolute',
    width,
    height,
  },
  block: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  fab: {
    position: 'absolute',
    bottom: width * 0.05,
    right: width * 0.05,
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
