import {Image, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {
  Canvas,
  Circle,
  LinearGradient,
  Paint,
  vec,
} from '@shopify/react-native-skia';
import {User} from '../shared/types';
import Avatar from '../shared/components/Avatar';

type ContributorProps = {
  user: User;
  index: number;
  imageUrl: string;
  name?: string;
  onPress?: () => void;
};

const gradients = [
  ['#223843', '#d77a61'],
  ['#ffb600', '#F69A97'],
  ['#d9ed92', '#184e77'],
];

const STROKE_WIDTH = 1.5;
const SIZE = 45 - STROKE_WIDTH * 2.5;
const CANVAS_SIZE = 50;

const Contributor: React.FC<ContributorProps> = ({
  index,
  imageUrl,
  name,
  onPress,
  user,
}) => {
  return (
    <Pressable style={styles.photoContainer} onPress={onPress}>
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
      {user ? (
        <Avatar size={SIZE} includeBorder={false} user={user} />
      ) : (
        <Image source={{uri: imageUrl}} style={styles.photo} />
      )}
    </Pressable>
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
});

export default Contributor;
