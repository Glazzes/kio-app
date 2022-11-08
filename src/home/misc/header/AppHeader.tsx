import {StyleSheet, View} from 'react-native';
import React, {useContext, useRef} from 'react';
import Contributors from '../../../misc/Contributors';
import FolderList from '../../folders/FolderList';
import FileHeader from '../../../misc/FileHeader';
import BreadCrumbs from '../../../misc/BreadCrumbs';
import {Folder} from '../../../shared/types';
import {NavigationContext} from '../../../navigation/NavigationContextProvider';

type AppHeaderProps = {
  folders: Folder[];
};

const AppHeader: React.FC<AppHeaderProps> = ({folders}) => {
  const {folder} = useContext(NavigationContext);
  const isRoot = useRef<boolean>(folder === undefined);

  return (
    <View style={styles.root}>
      {!isRoot.current && <BreadCrumbs />}
      {(folder?.summary.folders ?? 0) > 0 && <FolderList folders={folders} />}
      <Contributors />
      {(folder?.summary.files ?? 0) > 0 && (
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
