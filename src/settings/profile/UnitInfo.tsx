import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import React, {useEffect} from 'react';
import {ShadowView} from '@dimaportenko/react-native-shadow-view';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Circle} from 'react-native-svg';
import {ReText} from 'react-native-redash';

type UnitInfoProps = {};

const {width} = Dimensions.get('window');
const SIZE = 110;
const SPACING = 10;

const STROKE_WIDTH = 13;

const RADIUS = SIZE / 2 - STROKE_WIDTH;
const LENGHT = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const UnitInfo: React.FC<UnitInfoProps> = ({}) => {
  const progress = useSharedValue<number>(0);

  const percentage = useDerivedValue(() => {
    return `${Math.round(100 * progress.value).toString()}%`;
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    transform: [{rotateZ: `${-Math.PI / 2}rad`}],
    strokeDashoffset: LENGHT * (1 - progress.value),
  }));

  useEffect(() => {
    progress.value = withDelay(1000, withTiming(0.2, {duration: 1000}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ShadowView style={styles.unit}>
      <View style={styles.svgContainer}>
        <Svg width={SIZE} height={SIZE} style={styles.svg}>
          <Circle
            r={RADIUS}
            x={SIZE / 2}
            y={RADIUS + STROKE_WIDTH}
            stroke={'#6089fc'}
            strokeWidth={STROKE_WIDTH}
          />
          <AnimatedCircle
            animatedProps={animatedProps}
            r={RADIUS}
            x={SIZE / 2}
            y={RADIUS + STROKE_WIDTH}
            stroke={'#fff'}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={LENGHT}
            strokeLinecap={'round'}
          />
        </Svg>
        <ReText text={percentage} style={styles.percentage} />
      </View>
      <View>
        <Text style={styles.title}>My Unit</Text>
        <Text style={styles.space}>
          <Text style={styles.used}>1GB</Text> of 5GB used
        </Text>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Buy Storage</Text>
        </Pressable>
      </View>
    </ShadowView>
  );
};

const styles = StyleSheet.create({
  unit: {
    width: width * 0.9,
    height: SIZE + 20,
    paddingVertical: SPACING,
    paddingHorizontal: SPACING / 2,
    backgroundColor: '#1b47c4',
    borderRadius: SPACING,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 4,
      height: 2,
    },
    flexDirection: 'row',
    alignItems: 'center',
  },
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SIZE,
    marginRight: 5,
  },
  svg: {
    position: 'absolute',
  },
  percentage: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'UberBold',
  },
  title: {
    fontFamily: 'UberBold',
    fontSize: 20,
    color: '#fff',
  },
  used: {
    color: '#fff',
    fontFamily: 'UberBold',
  },
  space: {
    color: '#6089fc',
    fontFamily: 'UberBold',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#6089fc',
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'UberBold',
  },
});

export default UnitInfo;
