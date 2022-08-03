import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import Animated, {runOnJS, useAnimatedStyle} from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/MaterialCommunityIcons';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

type StarProps = {
  opacity: Animated.SharedValue<number>;
};

const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign);

const Star: React.FC<StarProps> = ({opacity}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const rStyle = useAnimatedStyle(() => {
    return {opacity: opacity.value};
  });

  const onPress = () => setIsSelected(prev => !prev);

  const tap = Gesture.Tap().onEnd(() => runOnJS(onPress)());

  return (
    <View style={styles.star}>
      <GestureDetector gesture={tap}>
        <Animated.View>
          <AnimatedAntDesign
            name={isSelected ? 'heart' : 'heart-outline'}
            color={isSelected ? '#ee3060' : '#fff'}
            size={25}
            style={rStyle}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
});

export default Star;
