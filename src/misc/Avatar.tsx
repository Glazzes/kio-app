import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Image,
  ImageStyle,
} from 'react-native';
import React from 'react';

type AvatarProps = {
  size: number;
  username: string;
  image?: string;
};

const Avatar: React.FC<AvatarProps> = ({size, username, image}) => {
  const avatarStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3366ff',
  };

  return (
    <View style={[avatarStyle, styles.margin]}>
      {image ? (
        <Image source={{uri: image}} style={avatarStyle as ImageStyle} />
      ) : (
        <View style={avatarStyle}>
          <Text style={styles.letter}>{username.slice(0, 1)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  margin: {
    marginRight: 10,
  },
  letter: {
    textTransform: 'capitalize',
    fontFamily: 'UberBold',
    color: '#fff',
  },
});

export default Avatar;
