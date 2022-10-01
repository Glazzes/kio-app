import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {
  Canvas,
  Circle,
  Fill,
  Group,
  LinearGradient,
  Mask,
  Paint,
  RoundedRect,
  useComputedValue,
  useLoop,
  useTiming,
  vec,
} from '@shopify/react-native-skia';
import FileSkeleton from '../home/misc/FileSkeleton';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';

type TestingProps = {};

const SIZE = 120;

const Testing: React.FC<TestingProps> = ({}) => {
  const timing = useTiming({from: -1, to: 1, loop: true}, {duration: 1500});

  const start = useComputedValue(() => vec(timing.current * 140, 0), [timing]);
  const end = useComputedValue(
    () => vec(140 * timing.current + 140, 0),
    [timing],
  );

  return (
    <Animated.View style={styles.root}>
      <Canvas style={styles.canvas}>
        <Group>
          <LinearGradient
            start={start}
            end={end}
            colors={['#EEF1FF', '#fff', '#EEF1FF']}
          />
          <RoundedRect x={0} y={0} width={140} height={140} r={5} />
          <RoundedRect x={0} y={150} width={140 * 0.75} height={15} r={5} />
          <RoundedRect x={0} y={170} width={70} height={15} r={5} />
        </Group>
      </Canvas>
      <Canvas style={styles.canvas}>
        <Group>
          <LinearGradient
            start={start}
            end={end}
            colors={['#EEF1FF', '#fff', '#EEF1FF']}
          />
          <RoundedRect x={0} y={0} width={140} height={140} r={5} />
          <RoundedRect x={0} y={150} width={140 * 0.75} height={15} r={5} />
          <RoundedRect x={0} y={170} width={70} height={15} r={5} />
        </Group>
      </Canvas>
      <Canvas style={styles.canvas}>
        <Group>
          <LinearGradient
            start={start}
            end={end}
            colors={['#EEF1FF', '#fff', '#EEF1FF']}
          />
          <RoundedRect x={0} y={0} width={140} height={140} r={5} />
          <RoundedRect x={0} y={150} width={140 * 0.75} height={15} r={5} />
          <RoundedRect x={0} y={170} width={70} height={15} r={5} />
        </Group>
      </Canvas>
      <Canvas style={styles.canvas}>
        <Group>
          <LinearGradient
            start={start}
            end={end}
            colors={['#EEF1FF', '#fff', '#EEF1FF']}
          />
          <RoundedRect x={0} y={0} width={140} height={140} r={5} />
          <RoundedRect x={0} y={150} width={140 * 0.75} height={15} r={5} />
          <RoundedRect x={0} y={170} width={70} height={15} r={5} />
        </Group>
      </Canvas>
      <Canvas style={styles.canvas}>
        <Group>
          <LinearGradient
            start={start}
            end={end}
            colors={['#EEF1FF', '#fff', '#EEF1FF']}
          />
          <RoundedRect x={0} y={0} width={140} height={140} r={5} />
          <RoundedRect x={0} y={150} width={140 * 0.75} height={15} r={5} />
          <RoundedRect x={0} y={170} width={70} height={15} r={5} />
        </Group>
      </Canvas>
      <Canvas style={styles.canvas}>
        <Group>
          <LinearGradient
            start={start}
            end={end}
            colors={['#EEF1FF', '#fff', '#EEF1FF']}
          />
          <RoundedRect x={0} y={0} width={140} height={140} r={5} />
          <RoundedRect x={0} y={150} width={140 * 0.75} height={15} r={5} />
          <RoundedRect x={0} y={170} width={70} height={15} r={5} />
        </Group>
      </Canvas>
      <Canvas style={styles.canvas}>
        <Group>
          <LinearGradient
            start={start}
            end={end}
            colors={['#EEF1FF', '#fff', '#EEF1FF']}
          />
          <RoundedRect x={0} y={0} width={140} height={140} r={5} />
          <RoundedRect x={0} y={150} width={140 * 0.75} height={15} r={5} />
          <RoundedRect x={0} y={170} width={70} height={15} r={5} />
        </Group>
      </Canvas>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    height: 200,
    width: 140,
  },
});

export default Testing;
