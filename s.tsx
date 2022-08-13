import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

type sProps = {};

const s: React.FC<sProps> = props => {
  const translate = useSharedValue({x: 0, y: 0});
  const offset = useSharedValue({x: 0, y: 0});

  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.value.x = translate.value.x;
      offset.value.y = translate.value.y;
    })
    .onChange(e => {
      translate.value.x = offset.value.x + e.translationX;
      translate.value.y = offset.value.y + e.translationY;
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      height: 150,
      width: 150,
      backgroundColor: props.color ?? 'lime',
      transform: [
        {translateX: translate.value.x},
        {translateY: translate.value.y},
      ],
    };
  });

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={pan}>
        <Animated.View style={rStyle} />
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default s;
