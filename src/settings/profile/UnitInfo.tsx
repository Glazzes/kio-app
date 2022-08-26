import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import React, {useEffect} from 'react';
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {ReText} from 'react-native-redash';
import {
  BlurMask,
  Canvas,
  RoundedRect,
  Circle,
  Skia,
  Path,
  useSharedValueEffect,
  useValue,
} from '@shopify/react-native-skia';

type UnitInfoProps = {};

const {width} = Dimensions.get('window');
const SIZE = 120;
const SPACING = 10;

const STROKE_WIDTH = 10;
const RADIUS = SIZE / 2 - STROKE_WIDTH;

const path = Skia.Path.Make();
path.moveTo(0, 0);
path.addArc(
  {x: SPACING * 2, y: SPACING * 2, width: RADIUS * 2, height: RADIUS * 2},
  270,
  360,
);

const UnitInfo: React.FC<UnitInfoProps> = ({}) => {
  const end = useValue(0);
  const progress = useSharedValue<number>(0);

  const percentage = useDerivedValue(() => {
    return `${Math.round(100 * progress.value).toString()}%`;
  }, [progress]);

  useSharedValueEffect(() => {
    end.current = progress.value;
  }, progress);

  useEffect(() => {
    progress.value = withDelay(1000, withTiming(0.2, {duration: 1000}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.unit}>
      <Canvas style={styles.canvas}>
        <RoundedRect
          y={(SIZE + SPACING) / 2}
          x={width * 0.1}
          width={width * 0.9 * 0.75}
          height={55}
          color={'#0b4199'}>
          <BlurMask blur={18} style={'normal'} />
        </RoundedRect>
        <RoundedRect
          x={0}
          y={0}
          width={width * 0.9}
          height={SIZE + SPACING * 2}
          r={5}
          color={'#3366ff'}
        />
        <Circle
          cy={SPACING * 2 + RADIUS}
          cx={SPACING * 2 + RADIUS}
          r={RADIUS}
          color={'#6089fc'}
          strokeWidth={STROKE_WIDTH}
          style={'stroke'}
        />
        <Path
          path={path}
          style={'stroke'}
          color={'#fff'}
          strokeCap={'round'}
          strokeWidth={STROKE_WIDTH}
          end={end}>
          <BlurMask blur={7} style={'solid'} />
        </Path>
      </Canvas>
      <View style={styles.placeholder}>
        <ReText text={percentage} style={styles.percentage} />
      </View>
      <View style={styles.storage}>
        <Text style={styles.title}>My Unit</Text>
        <Text style={styles.space}>
          <Text style={styles.used}>1GB</Text> of 5GB used
        </Text>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Buy Storage</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  unit: {
    width: width * 0.9,
    height: SIZE + SPACING * 2,
    marginVertical: SPACING / 2,
    flexDirection: 'row',
  },
  canvas: {
    position: 'absolute',
    width: '100%',
    height: SIZE + SPACING * 4,
  },
  placeholder: {
    margin: SPACING,
    width: RADIUS * 2 + STROKE_WIDTH + SPACING,
    height: RADIUS * 2 + STROKE_WIDTH + SPACING,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'UberBold',
  },
  storage: {
    marginVertical: SPACING,
    height: RADIUS * 2 + STROKE_WIDTH + SPACING,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'UberBold',
    fontSize: 18,
    color: '#fff',
  },
  used: {
    color: '#fff',
    fontFamily: 'Uber',
  },
  space: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Uber',
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
    fontFamily: 'Uber',
  },
});

export default UnitInfo;
