import {StyleSheet} from 'react-native';
import React from 'react';
import Animated, {BounceIn, Keyframe} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type OptionsMenuProps = {
  absX: number;
  absY: number;
};

const OPTION_SIZE = 40;
const MARGIN = 5;

const entering = new Keyframe({
  from: {
    width: 60,
    transform: [{scale: 0}, {translateX: 0}],
  },
  50: {
    width: 60,
    transform: [{scale: 1}, {translateX: 0}],
  },
  to: {
    width: 260,
    transform: [{scale: 1}, {translateX: 0}],
  },
});

const icons = ['information', 'link', 'share-variant', 'pencil', 'delete'];

const OptionsMenu: React.FC<OptionsMenuProps> = ({absX, absY}) => {
  return (
    <Animated.View entering={entering.duration(600)} style={styles.root}>
      {icons.map((icon, index) => {
        let backgroundColor = '#3366ff';
        if (icon === 'delete') backgroundColor = '#F94415';
        if (icon === 'pencil') backgroundColor = '#FFBC00';

        return (
          <Animated.View
            entering={BounceIn.duration(index * 600)}
            style={[styles.option, {backgroundColor}]}
            key={icon}>
            <Icon name={icon} color={'#fff'} size={20} />
          </Animated.View>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: MARGIN * 2,
    padding: MARGIN,
    height: OPTION_SIZE + MARGIN * 2,
    borderRadius: 30,
    backgroundColor: '#F3F3F4',
    overflow: 'hidden',
    flexDirection: 'row',
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
