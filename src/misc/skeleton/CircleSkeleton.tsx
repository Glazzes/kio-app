import React, {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type CircleSkeletonProps = {
  r: number;
  duration: number;
  colors?: [string, string];
};

const defaultColors: [string, string] = ['#F3F3F4', '#ababab'];

const CircleSkeleton: React.FC<CircleSkeletonProps> = ({
  r,
  colors,
  duration,
}) => {
  const pulseColors = colors ?? defaultColors;
  const backgroundColor = useSharedValue<string>(pulseColors[0]);

  const rStyle = useAnimatedStyle(() => {
    return {
      width: r * 2,
      height: r * 2,
      borderRadius: r,
      backgroundColor: backgroundColor.value,
    };
  });

  useEffect(() => {
    backgroundColor.value = withRepeat(
      withTiming(pulseColors[1], {duration}),
      -1,
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react/react-in-jsx-scope
  return <Animated.View style={rStyle} />;
};

export default CircleSkeleton;
