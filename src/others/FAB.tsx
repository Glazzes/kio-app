import {Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/AntDesign';
import {AnimatedButton, Folder} from '../utils/types';

type FABProps = {
  parent?: Folder;
};

const {width} = Dimensions.get('window');

const FAB_RADIUS = 25;
const RADIUS = width - FAB_RADIUS / 2;

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const actions: AnimatedButton[] = [
  {
    icon: 'person-plus',
    angle: Math.PI / 2,
  },
  {
    icon: 'camera',
    angle: (5 / 8) * Math.PI,
  },
  {
    icon: 'file-plus',
    angle: (6 / 8) * Math.PI,
  },
  {
    icon: 'folder-plus',
    angle: Math.PI,
  },
];

const FAB: React.FC<FABProps> = ({}) => {
  const progress = useSharedValue<number>(0);
  const buttonColor = useSharedValue<string>('#3366ff');
  const iconButtonColor = useSharedValue<string>('lightgrey');

  const rStyle = useAnimatedStyle(() => ({
    backgroundColor: buttonColor.value,
  }));

  return (
    <Animated.View style={[styles.fab, rStyle]}>
      {actions.map(action => {
        const actionStyle = useAnimatedStyle(() => ({
          transform: [
            {translateX: RADIUS * Math.cos(action.angle)},
            {translateY: RADIUS * Math.sin(action.angle)},
          ],
        }));

        return (
          <AnimatedIcon
            style={actionStyle}
            name={action.icon}
            key={`action-${action.icon}`}
          />
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fab: {
    height: FAB_RADIUS * 2,
    width: FAB_RADIUS * 2,
    borderRadius: FAB_RADIUS,
  },
});

export default FAB;
