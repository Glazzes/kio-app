import React from 'react';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {LogBox, Pressable} from 'react-native';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';

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
  const isAnimating = useSharedValue<boolean>(false);

  const color = useDerivedValue(() => {
    return effect.value === 0 ? '#fff' : '#4D96FF';
  }, [effect.value]);

  const animatedProps = useAnimatedProps(
    () => ({
      color: color.value,
    }),
    [color.value],
  );

  const performEffect = async () => {
    await impactAsync(ImpactFeedbackStyle.Light);
    if (action === 'flip') {
      effect.value = withTiming(effect.value === Math.PI ? 0 : Math.PI);
    }

    // high rotation values will crash the app
    if (action === 'rotate' && !isAnimating.value) {
      isAnimating.value = true;
      console.log(effect.value);

      const to = effect.value + Math.PI / 2;
      effect.value = withTiming(to, undefined, finished => {
        if (finished) {
          isAnimating.value = false;
          effect.value = effect.value === Math.PI * 2 ? 0 : effect.value;
        }
      });
    }
  };

  return (
    <Pressable onPress={performEffect} style={{marginRight: 10}}>
      <AnimatedIcon animatedProps={animatedProps} name={icon} size={27} />
    </Pressable>
  );
};

export default EffectIndicator;
