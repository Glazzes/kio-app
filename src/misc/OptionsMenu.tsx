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

const icons = ['information', 'link', 'share-variant', 'pencil', 'delete'];

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

const OptionsMenu: React.FC<OptionsMenuProps> = ({absX, absY}) => {
  return (
    <Animated.View entering={entering.duration(750)} style={styles.root}>
      {icons.map((icon, index) => {
        let backgroundColor = '#3366ff';
        if (icon === 'delete') backgroundColor = '#F94415';
        if (icon === 'pencil') backgroundColor = '#FFBC00';

        return (
          <Animated.View
            entering={BounceIn.duration(index * 500)}
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
    paddingVertical: MARGIN,
    height: OPTION_SIZE + MARGIN * 2,
    borderRadius: (OPTION_SIZE + MARGIN * 2) / 2,
    backgroundColor: '#F3F3F4',
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 1,
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
