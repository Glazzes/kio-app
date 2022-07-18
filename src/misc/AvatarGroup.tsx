import {View, Text, StyleSheet, Image, ViewStyle} from 'react-native';
import React, {useRef} from 'react';

type AvatarGroupProps = {
  photos: string[];
};

const SIZE = 30;
const SPACER = 0.6;

const photos = [
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/women/21.jpg',
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/men/81.jpg',
  'https://randomuser.me/api/portraits/men/68.jpg',
];

const AvatarGroup: React.FC<AvatarGroupProps> = ({}) => {
  const uris = useRef<string[]>(
    photos.slice(photos.length - 4, photos.length).reverse(),
  );

  const containerStyles = useRef<ViewStyle>({
    width: uris.current.length * SIZE,
    maxWidth: SIZE + uris.current.length * (SIZE * SPACER),
  });

  return (
    <View style={[styles.container, containerStyles.current]}>
      {uris.current.map((uri, index) => {
        const position = {
          left: index * (SIZE * SPACER),
        };

        return (
          <Image
            key={`${uri}${index}`}
            source={{uri}}
            style={[styles.circle, position]}
          />
        );
      })}
      {photos.length >= 4 && (
        <View style={[styles.circle, styles.plus]}>
          <Text style={styles.text}>{photos.length - 4}+</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SIZE,
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    top: 0,
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1,
    borderColor: '#fff',
  },
  plus: {
    justifyContent: 'center',
    alignItems: 'center',
    left: SIZE * SPACER * 4,
    backgroundColor: '#4389FE',
    padding: 5,
  },
  text: {
    fontFamily: 'UberBold',
    color: '#fff',
  },
});

export default React.memo(AvatarGroup);
