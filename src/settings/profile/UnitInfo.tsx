import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  BlurMask,
  Canvas,
  RoundedRect,
  Circle,
  Skia,
  Path,
  Text as SkText,
  useValue,
  LinearGradient,
  vec,
  runTiming,
  useFont,
  useComputedValue,
} from '@shopify/react-native-skia';
import {Navigation} from 'react-native-navigation';
import {Modals} from '../../navigation/screens/modals';
import {axiosInstance} from '../../shared/requests/axiosInstance';
import {apiUnitSize} from '../../shared/requests/contants';
import {UnitSize} from '../../shared/types';
import {convertBytesToRedableUnit} from '../../shared/functions/convertBytesToRedableUnit';
import {displayToast, unitSizeLoadErrorMessage} from '../../shared/toast';

type UnitInfoProps = {};

const {width} = Dimensions.get('window');
const SIZE = 110;
const SPACING = 10;
const STROKE_WIDTH = 10;
const RADIUS = SIZE / 2 - STROKE_WIDTH;

const center = {
  x: SPACING * 2 + RADIUS,
  y: SPACING * 2 + RADIUS,
};

const path = Skia.Path.Make();
path.moveTo(0, 0);
path.addArc(
  {x: SPACING * 2, y: SPACING * 2, width: RADIUS * 2, height: RADIUS * 2},
  270,
  359.9,
);

const UnitInfo: React.FC<UnitInfoProps> = ({}) => {
  const [storage, setStorage] = useState<UnitSize>({capacity: 0, used: 0});

  const end = useValue(0);
  const uberBold = useFont(require('../../assets/UberBold.otf'), 20);

  const x = useComputedValue(() => {
    return (
      center.x -
      (uberBold?.getTextWidth(`${Math.floor(end.current * 100)}%`) ?? 0) / 2
    );
  }, [end, uberBold]);

  const text = useComputedValue(() => {
    return `${Math.floor(end.current * 100)}%`;
  }, [end]);

  const animateArc = (to: number) => {
    runTiming(end, {from: 0, to}, {duration: 2000});
  };

  const showPricingSheet = () => {
    Navigation.showModal({
      component: {
        name: Modals.PRICING,
      },
    });
  };

  useEffect(() => {
    if (uberBold) {
      axiosInstance
        .get<UnitSize>(apiUnitSize)
        .then(({data}) => {
          animateArc(data.used / data.capacity);
          setStorage(data);
        })
        .catch(_ => displayToast(unitSizeLoadErrorMessage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uberBold]);

  return (
    <View style={styles.unit}>
      <Canvas style={styles.canvas}>
        <RoundedRect
          y={(SIZE + SPACING) / 2}
          x={width * 0.1}
          width={width * 0.9 * 0.8}
          height={55}
          color={'#0b4199'}>
          <BlurMask blur={16} style={'normal'} />
        </RoundedRect>
        <RoundedRect
          x={0}
          y={0}
          width={width * 0.9}
          height={SIZE + SPACING * 2}
          r={5}
          color={'#3366ff'}>
          <LinearGradient
            colors={['#0b4199', '#3366ff']}
            start={vec(0, 0)}
            end={vec(width * 0.9, SIZE + SPACING * 2)}
          />
        </RoundedRect>
        <Circle
          cy={center.y}
          cx={center.x}
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
          <BlurMask blur={5} style={'solid'} />
        </Path>
        {uberBold !== null && (
          <SkText
            x={x}
            y={center.y + 7.5}
            color={'#fff'}
            text={text}
            font={uberBold}
          />
        )}
      </Canvas>
      <View style={styles.placeholder} />
      <View style={styles.storage}>
        <Text style={styles.title}>My Unit</Text>
        <Text style={styles.space}>
          <Text style={styles.used}>
            {convertBytesToRedableUnit(storage.used)}
          </Text>{' '}
          of {convertBytesToRedableUnit(storage.capacity)} used
        </Text>
        <Pressable style={styles.button} onPress={showPricingSheet}>
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
