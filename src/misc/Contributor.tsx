import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {
  Canvas,
  Circle,
  LinearGradient,
  Paint,
  vec,
} from '@shopify/react-native-skia';

type ContributorProps = {
  index: number;
  imageUrl: string;
  name?: string;
};

const gradients = [
  ['#223843', '#d77a61'],
  ['#ffb600', '#F69A97'],
  ['#d9ed92', '#184e77'],
];

const STROKE_WIDTH = 1.5;
const SIZE = 45 - STROKE_WIDTH * 2.5;
const CANVAS_SIZE = 50;

const Contributor: React.FC<ContributorProps> = ({index, imageUrl, name}) => {
  return (
    <View style={styles.photoContainer}>
      <Canvas style={styles.canvas}>
        <Circle
          r={CANVAS_SIZE / 2 - STROKE_WIDTH}
          cx={CANVAS_SIZE / 2}
          cy={CANVAS_SIZE / 2}
          color={'transparent'}>
          <Paint style={'stroke'} strokeWidth={STROKE_WIDTH}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(CANVAS_SIZE, CANVAS_SIZE)}
              colors={gradients[index % gradients.length]}
            />
          </Paint>
        </Circle>
      </Canvas>
      <Image source={{uri: imageUrl}} style={styles.photo} />
    </View>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    position: 'absolute',
  },
  photo: {
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
  },
  username: {
    marginTop: 20,
    fontFamily: 'bold',
  },
});

export default Contributor;
