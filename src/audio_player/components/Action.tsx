import React from 'react';
import {Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ActionProps = {
  icon: string;
  callback: () => void;
  color?: string;
  size?: number;
};

const ICON_SIZE = 23;

const Action: React.FC<ActionProps> = ({icon, color, size, callback}) => {
  return (
    <Pressable onPress={callback} hitSlop={25}>
      <Icon name={icon} color={color ?? '#1c1514'} size={size ?? ICON_SIZE} />
    </Pressable>
  );
};

export default Action;
