import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import FilesList from './files/FilesList';

type HomeProps = {
  folderId?: string;
};

const Home: NavigationFunctionComponent<HomeProps> = ({componentId}) => {
  const [canRegisterScreen, setCanRegisterScreen] = useState<boolean>();

  return (
    <View style={styles.root}>
      <FilesList />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Home.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

export default Home;
