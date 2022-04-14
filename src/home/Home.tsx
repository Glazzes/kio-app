import {View, StyleSheet, Text} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const Home: NavigationFunctionComponent = ({}) => {
  const translateY = useSharedValue<number>(100);
  const offset = useSharedValue<number>(0);

  const pan = Gesture.Pan()
    .onStart(e => {
      offset.value = translateY.value;
    })
    .onChange(e => {
      translateY.value = offset.value + e.translationY;
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      width: 50,
      height: 50,
      backgroundColor: 'tomato',
      transform: [{translateY: translateY.value}],
    };
  });

  return (
    <GestureHandlerRootView>
      <View style={[styles.root]}>
        <Text>Welcome to home</Text>
        <GestureDetector gesture={pan}>
          <Animated.View style={rStyle} />
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

Home.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

export default Home;
