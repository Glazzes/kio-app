import React, {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type SquareSkeletonProps = {
  width: number;
  height: number;
  borderRadius: number;
  duration: number;
  colors?: [string, string];
};

const defaultColors: [string, string] = ['#F3F3F4', '#ababab'];

const SquareSkeleton: React.FC<SquareSkeletonProps> = ({
  width,
  height,
  borderRadius,
  colors,
  duration,
}) => {
  const pulseColors = colors ?? defaultColors;
  const backgroundColor = useSharedValue<string>(pulseColors[0]);

  const rStyle = useAnimatedStyle(() => {
    return {
      width,
      height,
      borderRadius,
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

export default SquareSkeleton;
