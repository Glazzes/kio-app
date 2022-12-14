import {StyleSheet, View} from 'react-native';
import React, {useContext} from 'react';
import Contributors from '../../../shared/components/Contributors';
import FileHeader from './FileHeader';
import BreadCrumbs from './BreadCrumbs';
import {Folder, User} from '../../../shared/types';
import {NavigationContext} from '../../../navigation/components/NavigationContextProvider';
import {Screens} from '../../../enums/screens';
import FolderList from '../../folders/components/FolderList';

type AppHeaderProps = {
  folders: Folder[];
  numberOfFiles: number;
  coowners: User[];
  isFetching: boolean;
};

const AppHeader: React.FC<AppHeaderProps> = ({
  folders,
  numberOfFiles,
  isFetching,
  coowners,
}) => {
  const {componentId} = useContext(NavigationContext);

  return (
    <View style={styles.root}>
      {componentId !== Screens.MY_UNIT ? (
        <BreadCrumbs isOnTopOfFolders={folders.length > 0} />
      ) : null}
      {!isFetching && folders.length > 0 ? (
        <FolderList folders={folders} />
      ) : null}

      {!isFetching && coowners.length > 0 ? (
        <Contributors coowners={coowners} />
      ) : null}

      {!isFetching && numberOfFiles > 0 ? (
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
