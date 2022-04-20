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
import ImageThumbnail from './files/thumnnails/ImageThumbnail';

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

  return (
    <View style={[styles.root]}>
      <ImageThumbnail />
    </View>
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
