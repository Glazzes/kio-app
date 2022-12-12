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
import {apiProfilePictureByUserIdAndPictureId} from '../requests/contants';
import emitter, {updatePictureEventName} from '../emitter';
import {EventSubscription} from 'fbemitter';

type AvatarProps = {
  user: User;
  size: number;
  includeBorder: boolean;
  extraStyle?: ViewStyle & ImageStyle;
  listenToUpdateEvent?: boolean;
  nativeId?: string;
  fontSize?: number;
};

const Avatar: React.FC<AvatarProps> = ({
  user,
  includeBorder,
  size,
  extraStyle,
  listenToUpdateEvent,
  nativeId,
  fontSize,
}) => {
  const state = useSnapshot(authState);
  const isAuthenticatedUser = user.id === state.user.id;

  const [hasUpdatedPicture, setHasUpdatedPicture] = useState<boolean>(false);

  const [uri, setUri] = useState<string>(() => {
    if (isAuthenticatedUser && state.user.pictureId) {
      return apiProfilePictureByUserIdAndPictureId(
        state.user.id,
        state.user.pictureId,
      );
    }

    if (!isAuthenticatedUser && user.pictureId) {
      return apiProfilePictureByUserIdAndPictureId(user.id, user.pictureId);
    }

    return '';
  });

  const circle: ViewStyle & ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...extraStyle,
  };

  useEffect(() => {
    let susbscription: EventSubscription | undefined;

    if (listenToUpdateEvent) {
      susbscription = emitter.addListener(
        updatePictureEventName,
        (newPic: string) => {
          setHasUpdatedPicture(true);
          setUri(newPic);
        },
      );
    }

    return () => {
      susbscription?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticatedUser && state.user.pictureId) {
      setUri(
        apiProfilePictureByUserIdAndPictureId(
          state.user.id,
          state.user.pictureId,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user]);

  if (user.pictureId || hasUpdatedPicture) {
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
    <View
      nativeID={nativeId}
      style={[circle, styles.bg, includeBorder ? styles.border : {}]}>
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
