import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  LayoutChangeEvent,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {Canvas, RoundedRect, Shadow} from '@shopify/react-native-skia';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type GenericModalProps = {
  title: string;
  message: string;
};

const {width} = Dimensions.get('window');
const MODAL_WIDTH = width * 0.75;
const SPACING = 10;

const GenericModal: NavigationFunctionComponent<GenericModalProps> = ({
  componentId,
  title,
  message,
}) => {
  const [dimensions, setDimensions] = useState({with: 1, height: 1});

  const onLayout = (e: LayoutChangeEvent) => {
    const {width: w, height: h} = e.nativeEvent.layout;
    setDimensions({with: w, height: h});
  };

  const canvaStyles: ViewStyle = useMemo(
    () => ({
      width: dimensions.with + 60,
      height: dimensions.height + 60,
      position: 'absolute',
      transform: [{translateX: -10}, {translateY: -10}],
      backgroundColor: '#fff',
    }),
    [dimensions],
  );

  const close = () => {
    Navigation.dismissModal(componentId);
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
    <View style={styles.root}>
      <Animated.View style={[styles.modal, rStyle]} onLayout={onLayout}>
        {dimensions.with !== 1 && (
          <Canvas style={canvaStyles}>
            <RoundedRect
              x={10}
              y={10}
              width={dimensions.with}
              height={dimensions.height}
              r={SPACING}
              color={'#fff'}>
              <Shadow blur={10} dx={10} dy={12} color={'rgba(0, 0, 0, 0.2)'} />
            </RoundedRect>
          </Canvas>
        )}
        <Text style={styles.title}>{title}</Text>
        <Text>{message}</Text>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={close}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.confirmButton]}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

GenericModal.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: MODAL_WIDTH,
    backgroundColor: '#fff',
    borderRadius: SPACING,
    padding: SPACING,
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    width: MODAL_WIDTH / 2 - 15,
    height: 40,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#EDF1F7',
  },
  cancelButtonText: {
    fontFamily: 'UberBold',
    color: '#c3c3c3',
  },
  confirmButton: {
    backgroundColor: '#3366ff',
  },
  confirmButtonText: {
    fontFamily: 'UberBold',
    color: '#fff',
  },
});

export default GenericModal;
