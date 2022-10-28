import {StyleSheet, Image, Pressable, View, Text} from 'react-native';
import React, {useContext, useRef} from 'react';
import Animated, {BounceIn, FadeOut} from 'react-native-reanimated';
import {Navigation} from 'react-native-navigation';
import {NavigationContext} from '../../../navigation/NavigationContextProvider';
import {useSnapshot} from 'valtio';
import authState from '../../../store/authStore';

const IMAGE_SIZE = 40;

const UserAvatar = () => {
  const state = useSnapshot(authState);
  const componentId = useContext(NavigationContext);
  const ref = useRef<View>(null);

  const openUserMenu = () => {
    ref.current?.measure((x, y, w, h, pageX, pageY) => {
      Navigation.showModal({
        component: {
          name: 'UserMenu',
          passProps: {
            x: pageX,
            y: pageY,
            parentComponentId: componentId,
          },
        },
      });
    });
  };

  return (
    <Pressable ref={ref} hitSlop={40} onPress={openUserMenu}>
      {state.user.profilePicture ? (
        <Image
          source={{
            uri: state.user.profilePicture,
          }}
          style={styles.image}
          resizeMode={'cover'}
        />
      ) : (
        <View style={styles.initialContainer}>
          <Text style={styles.initial}>{state.user.username.slice(0, 1)}</Text>
        </View>
      )}

      <Animated.View
        entering={BounceIn.duration(300)}
        exiting={FadeOut.duration(300)}
        style={styles.indicator}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
  initialContainer: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3366ff',
  },
  initial: {
    fontFamily: 'UberBold',
    fontSize: 15,
    color: '#fff',
    textTransform: 'capitalize',
  },
  indicator: {
    height: 12,
    width: 12,
    borderRadius: 5,
    backgroundColor: '#3366ff',
    borderColor: '#fff',
    borderWidth: 1,
    position: 'absolute',
    top: IMAGE_SIZE / 2 - 6 + (IMAGE_SIZE / 2) * -Math.sin(Math.PI / 4),
    left: IMAGE_SIZE / 2 - 6 + (IMAGE_SIZE / 2) * Math.cos(Math.PI / 4),
  },
});

export default UserAvatar;
