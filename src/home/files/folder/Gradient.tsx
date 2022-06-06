import {StyleSheet} from 'react-native';
import React from 'react';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {LinearGradient} from 'expo-linear-gradient';

type GradientProps = {
  opacity: Animated.SharedValue<number>;
};

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const Gradient: React.FC<GradientProps> = ({opacity}) => {
  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      borderRadius: 10,
    };
  });

  return (
    <AnimatedLinearGradient
      start={{x: 1, y: 0}}
      end={{y: 1, x: 1}}
      colors={['rgba(0, 0, 0, 0.2)', 'transparent', 'rgba(0, 0, 0, 0.2)']}
      style={[StyleSheet.absoluteFill, rStyle]}
    />
  );
};

export default Gradient;
