import {StyleSheet, View} from 'react-native';
import React, {useContext} from 'react';
import Contributors from '../../../../misc/Contributors';
import FolderList from '../../../folders/FolderList';
import FileHeader from '../../../../misc/FileHeader';
import BreadCrumbs from '../../../../misc/BreadCrumbs';
import {Folder} from '../../../../shared/types';
import {NavigationContext} from '../../../../navigation/NavigationContextProvider';
import {Screens} from '../../../../enums/screens';

type AppHeaderProps = {
  fetchedFiles: boolean;
  fetchedFolders: boolean;
  folders: Folder[];
};

const AppHeader: React.FC<AppHeaderProps> = ({
  folders,
  fetchedFiles,
  fetchedFolders,
}) => {
  const {folder, componentId} = useContext(NavigationContext);

  return (
    <View style={styles.root}>
      {componentId !== Screens.MY_UNIT && <BreadCrumbs />}
      {(folder?.summary.folders ?? 0) > 0 && fetchedFolders && (
        <FolderList folders={folders} />
      )}
      {fetchedFiles && fetchedFolders && folders.length > 0 && <Contributors />}
      {(folder?.summary.files ?? 0) > 0 && fetchedFiles && (
        <FileHeader title={'Files'} itemLength={8} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
});

export default AppHeader;
