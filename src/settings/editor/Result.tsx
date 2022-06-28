import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import FAB from '../../misc/filefab/FAB';
import SearchBar from '../../misc/SearchBar';
import Appbar from '../../misc/Appbar';
import ImageTest from '../../misc/ImageTest';

type ResultProps = {
  uri?: string;
};

const Result: NavigationFunctionComponent<ResultProps> = ({
  uri,
  componentId,
}) => {
  useEffect(() => {
    impactAsync(ImpactFeedbackStyle.Medium);
  }, []);

  const [opacity, setOpacity] = useState<number>(1);

  return (
    <View style={[styles.root]}>
      <Appbar />
      <SearchBar />
      <ImageTest />
      <FAB />
    </View>
  );
};

Result.options = {
  sideMenu: {
    right: {
      enabled: true,
    },
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  box: {
    height: 100,
    width: 100,
    backgroundColor: 'orange',
  },
});

export default Result;
