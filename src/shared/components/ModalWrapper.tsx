import {
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {Canvas, RoundedRect, Shadow} from '@shopify/react-native-skia';

type ModalWrapperProps = {
  style?: ViewStyle;
};

const {width} = Dimensions.get('window');
const MODAL_WIDTH = width * 0.75;
const SPACING = 10;

const ModalWrapper: React.FC<ModalWrapperProps> = ({children, style}) => {
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  const canvasStyles: ViewStyle = useMemo(
    () => ({
      height: dimensions.height + 60,
      width: dimensions.width + 60,
      position: 'absolute',
      top: 0,
      transform: [{translateY: -10}, {translateX: -10}],
      backgroundColor: '#fff',
    }),
    [dimensions],
  );

  const onLayout = ({
    nativeEvent: {
      layout: {width: w, height: h},
    },
  }: LayoutChangeEvent) => {
    setDimensions({width: w, height: h});
  };

  const scale = useSharedValue<number>(0);
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  useEffect(() => {
    scale.value = withDelay(
      200,
      withTiming(1, {
        duration: 300,
        easing: Easing.bezierFn(0.34, 1.56, 0.64, 1), // https://easings.net/#easeOutBack
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[style ?? styles.modal, rStyle]} onLayout={onLayout}>
      {dimensions.width !== 0 && dimensions.height !== 1 && (
        <Canvas style={canvasStyles}>
          <RoundedRect
            x={10}
            y={10}
            width={dimensions.width}
            height={dimensions.height}
            r={10}
            color={'#fff'}>
            <Shadow blur={10} dx={10} dy={12} color={'rgba(0, 0, 0, 0.2)'} />
          </RoundedRect>
        </Canvas>
      )}
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: MODAL_WIDTH,
    backgroundColor: '#fff',
    borderRadius: SPACING,
    padding: SPACING,
  },
});

export default ModalWrapper;
