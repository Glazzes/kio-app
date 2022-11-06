import {StyleSheet, View} from 'react-native';
import React from 'react';
import Contributors from '../../../misc/Contributors';
import FolderList from '../../folders/FolderList';
import FileHeader from '../../../misc/FileHeader';
import BreadCrumbs from '../../../misc/BreadCrumbs';
import {Folder} from '../../../shared/types';

type AppHeaderProps = {
  folders: Folder[];
};

export default function AppHeader({folders}: AppHeaderProps) {
  return (
    <View style={styles.root}>
      <BreadCrumbs />
      <FolderList folders={folders} />
      <Contributors />
      <FileHeader title={'Files'} itemLength={8} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
});
