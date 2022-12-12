import {StyleSheet, View} from 'react-native';
import React, {useContext} from 'react';
import Contributors from '../../../misc/Contributors';
import FolderList from '../../folders/FolderList';
import FileHeader from '../../../misc/FileHeader';
import BreadCrumbs from '../../../misc/BreadCrumbs';
import {Folder, User} from '../../../shared/types';
import {NavigationContext} from '../../../navigation/components/NavigationContextProvider';
import {Screens} from '../../../enums/screens';

type AppHeaderProps = {
  folders: Folder[];
  coowners: User[];
  isFetching: boolean;
};

const AppHeader: React.FC<AppHeaderProps> = ({
  folders,
  isFetching,
  coowners,
}) => {
  const {folder, componentId} = useContext(NavigationContext);

  return (
    <View style={styles.root}>
      {componentId !== Screens.MY_UNIT ? <BreadCrumbs /> : null}
      {!isFetching && (folder?.summary.folders ?? 0) > 0 ? (
        <FolderList folders={folders} />
      ) : null}

      {!isFetching && folders.length > 0 && coowners.length > 0 ? (
        <Contributors coowners={coowners} />
      ) : null}

      {!isFetching && (folder?.summary.files ?? 0) > 0 ? (
        <FileHeader title={'Files'} itemLength={8} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
});

export default AppHeader;
