import {StyleSheet, Dimensions, Pressable} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {Navigation} from 'react-native-navigation';

type FABOptionProps = {
  action: {icon: string; angle: number; index: number};
  progress: Animated.SharedValue<number>;
};

const {width} = Dimensions.get('window');
const BUTTON_RADIUS = 40;
const END_POSITION = width / 2 - BUTTON_RADIUS / 2;

const AnimatedTouchable = Animated.createAnimatedComponent(Pressable);

const FABOption: React.FC<FABOptionProps> = ({action, progress}) => {
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: END_POSITION * Math.cos(action.angle) * progress.value},
        {translateY: END_POSITION * -Math.sin(action.angle) * progress.value},
      ],
    };
  });

  const onPress = () => {
    Navigation.showModal({
      component: {
        name: 'Modal',
      },
    });
  };

  return (
    <AnimatedTouchable style={[styles.button, rStyle]} onPress={onPress}>
      <Icon name={action.icon} color={'#fff'} size={20} />
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: BUTTON_RADIUS,
    height: BUTTON_RADIUS,
    borderRadius: BUTTON_RADIUS / 2,
    backgroundColor: '#3366ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(FABOption);
