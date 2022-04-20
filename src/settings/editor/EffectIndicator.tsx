import React from 'react';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {IconButton} from 'native-base';
import {LogBox} from 'react-native';

LogBox.ignoreLogs(['Failed prop type: Invalid prop `color`']);

type EffectIndicatorProps = {
  effect: Animated.SharedValue<number>;
  icon: 'format-rotate-90' | 'flip-horizontal' | 'flip-vertical';
  action: 'flip' | 'rotate';
};

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

const EffectIndicator: React.FC<EffectIndicatorProps> = ({
  effect,
  icon,
  action,
}) => {
  const color = useDerivedValue(() => {
    return effect.value === 0 ? '#fff' : '#4D96FF';
  }, [effect.value]);

  const animatedProps = useAnimatedProps(
    () => ({
      color: color.value,
    }),
    [color.value],
  );

  const performEffect = () => {
    if (action === 'flip') {
      effect.value = effect.value === Math.PI ? 0 : Math.PI;
    }

    if (action === 'rotate') {
      effect.value = (effect.value + Math.PI / 2) % (Math.PI * 2);
    }
  };

  return (
    <IconButton
      icon={
        <AnimatedIcon animatedProps={animatedProps} name={icon} size={28} />
      }
      onPress={performEffect}
      borderRadius={'full'}
      _icon={{
        size: 'lg',
      }}
    />
  );
};

export default EffectIndicator;
