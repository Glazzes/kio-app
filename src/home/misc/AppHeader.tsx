import {View} from 'react-native';
import React from 'react';
import Appbar from './Appbar';
import Contributors from '../../misc/Contributors';
import FolderList from '../../misc/FolderList';
import Animated from 'react-native-reanimated';

type AppHeaderProps = {
  scrollY: Animated.SharedValue<number>;
};

export default function AppHeader({scrollY}: AppHeaderProps) {
  return (
    <View>
      <Contributors />
      <FolderList />
    </View>
  );
}
