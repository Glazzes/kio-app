import {
  View,
  Text,
  StyleSheet,
  Image,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {User} from '../types';
import {useSnapshot} from 'valtio';
import authState from '../../store/authStore';
import {
  apiFindFolderFilesByIdUrl,
  apiProfilePictureMeUrl,
} from '../requests/contants';
import emitter, {updatePictureEventName} from '../emitter';

type AvatarProps = {
  user: User;
  size: number;
  includeBorder: boolean;
  nativeId?: string;
  fontSize?: number;
};

const HEIGHT = 50;

const Avatar: React.FC<AvatarProps> = ({
  user,
  includeBorder,
  size,
  nativeId,
  fontSize,
}) => {
  const state = useSnapshot(authState);
  const isAuthenticatedUser = state.user.id === user.id;

  const [hasUpdatedPicture, setHasUpdatedPicture] = useState<boolean>(false);
  const [uri, setUri] = useState<string>(
    isAuthenticatedUser
      ? apiProfilePictureMeUrl
      : apiFindFolderFilesByIdUrl(user.id),
  );

  const circle: ViewStyle & ImageStyle = {
    width: size ?? HEIGHT,
    height: size ?? HEIGHT,
    borderRadius: (size ?? HEIGHT) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  };

  useEffect(() => {
    const updatePicture = emitter.addListener(
      updatePictureEventName,
      (newPic: string) => {
        setHasUpdatedPicture(true);
        setUri(newPic);
      },
    );
    return updatePicture.remove;
  }, []);

  if (user.hasProfilePicture || hasUpdatedPicture) {
    return (
      <Image
        nativeID={nativeId}
        source={{
          uri,
          headers: {Authorization: `Bearer ${state.tokens.accessToken}`},
        }}
        style={[circle, includeBorder ? styles.border : {}]}
      />
    );
  }

  return (
    <View style={[circle, styles.bg, includeBorder ? styles.border : {}]}>
      <Text style={[styles.initial, {fontSize}]}>
        {user.username.substring(0, 1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderColor: '#fff',
  },
  bg: {
    backgroundColor: '#3366ff',
  },
  initial: {
    fontSize: 15,
    fontFamily: 'UberBold',
    color: '#fff',
    textTransform: 'capitalize',
  },
});

export default Avatar;
