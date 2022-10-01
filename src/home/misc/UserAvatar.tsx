import {StyleSheet, Image, Pressable} from 'react-native';
import React, {useContext, useRef} from 'react';
import Animated, {BounceIn, FadeOut} from 'react-native-reanimated';
import {Navigation} from 'react-native-navigation';
import {NavigationContext} from '../../navigation/NavigationContextProvider';

const IMAGE_SIZE = 40;

const UserAvatar = () => {
  const componentId = useContext(NavigationContext);
  const ref = useRef<Image>(null);

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
    <Pressable hitSlop={40} onPress={openUserMenu}>
      <Image
        ref={ref}
        source={{
          uri: 'https://pettime.net/wp-content/uploads/2021/04/Dalmatian-2-10.jpg',
        }}
        style={styles.image}
        resizeMode={'cover'}
      />
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
