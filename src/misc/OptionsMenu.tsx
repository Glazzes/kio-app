import {Dimensions, Pressable, StyleSheet, ViewStyle} from 'react-native';
import React, {useRef} from 'react';
import Animated, {BounceIn, Keyframe} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import emitter from '../utils/emitter';

type OptionsMenuProps = {
  cx: number;
  cy: number;
  ix: number;
  iy: number;
};

const {width, height} = Dimensions.get('window');
const icons = ['information', 'link', 'share-variant', 'pencil', 'delete'];

const OPTION_SIZE = 35;
const MARGIN = 5;

const MENU_HEIGHT = OPTION_SIZE + MARGIN * 2;
const MENU_WIDTH = MENU_HEIGHT * icons.length;

const entering = new Keyframe({
  0: {
    width: OPTION_SIZE + MARGIN * 2,
    transform: [{scale: 0}, {translateX: 0}],
  },
  33: {
    width: OPTION_SIZE + MARGIN * 2,
    transform: [{scale: 1}, {translateX: 0}],
  },
  100: {
    width: (OPTION_SIZE + MARGIN * 2) * icons.length,
    transform: [{scale: 1}, {translateX: 0}],
  },
});

const exiting = new Keyframe({
  0: {
    width: (OPTION_SIZE + MARGIN * 2) * icons.length,
    transform: [{scale: 1}, {translateX: 0}],
  },
  33: {
    width: OPTION_SIZE + MARGIN * 2,
    transform: [{scale: 1}, {translateX: 0}],
  },
  100: {
    width: OPTION_SIZE + MARGIN * 2,
    transform: [{scale: 0}, {translateX: 0}],
  },
});

function getPosition(absX: number, absY: number): {left: number; top: number} {
  let x = absX;
  let y = absY - MENU_HEIGHT - MARGIN * 2;

  if (absX + MENU_WIDTH > width) {
    const offset = absX - MENU_WIDTH + (width - absX) - MARGIN * 2;
    x = offset;
  }

  return {top: y, left: x};
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({cx, cy, ix, iy}) => {
  const containerStyle = useRef<ViewStyle>({
    top: -cy,
    left: -cx,
  });

  const menuStyle = useRef(getPosition(ix, cy));

  const onPress = () => {
    emitter.emit('close.options.menu');
  };

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, containerStyle.current]}>
      <Animated.View
        entering={entering.duration(700)}
        exiting={exiting.duration(700)}
        style={[styles.root, menuStyle.current]}>
        {icons.map((icon, index) => {
          let backgroundColor = '#3366ff';
          if (icon === 'delete') backgroundColor = '#F94415';
          if (icon === 'pencil') backgroundColor = '#FFBC00';

          return (
            <Animated.View
              entering={BounceIn.duration(index * 300)}
              style={[styles.option, {backgroundColor}]}
              key={icon}>
              <Icon name={icon} color={'#fff'} size={20} />
            </Animated.View>
          );
        })}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height,
    width,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  root: {
    paddingVertical: MARGIN,
    height: OPTION_SIZE + MARGIN * 2,
    borderRadius: OPTION_SIZE + MARGIN * 2,
    backgroundColor: '#fff',
    flexDirection: 'row',
    position: 'absolute',
    overflow: 'hidden',
  },
  option: {
    height: OPTION_SIZE,
    width: OPTION_SIZE,
    borderRadius: OPTION_SIZE / 2,
    backgroundColor: '#3366ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: MARGIN,
  },
});

export default OptionsMenu;
