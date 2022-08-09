import {View} from 'react-native';
import React from 'react';
import Appbar from './Appbar';
import Contributors from '../../misc/Contributors';
import FolderList from '../../misc/FolderList';
import Animated from 'react-native-reanimated';
import FileHeader from '../../misc/FileHeader';

type AppHeaderProps = {
  scrollY: Animated.SharedValue<number>;
};

export default function AppHeader({scrollY}: AppHeaderProps) {
  return (
    <View>
      <FolderList />
      <Contributors />
      <FileHeader title={'Files'} itemLength={8} />
    </View>
  );
}
