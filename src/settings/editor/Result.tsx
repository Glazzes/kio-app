import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import FAB from '../../misc/filefab/FAB';
import SearchBar from '../../misc/SearchBar';
import Appbar from '../../misc/Appbar';
import ImageTest from '../../misc/ImageTest';
import SearchableText from '../../misc/SearchableText';
import CircleSkeleton from '../../misc/skeleton/CircleSkeleton';
import SquareSkeleton from '../../misc/skeleton/SquareSkeleton';
import FileWrapper from '../../misc/FileWrapper';
import ImageThumbnail from '../../home/files/thumnnails/ImageThumbnail';
import {useSharedValue} from 'react-native-reanimated';
import {File} from '../../utils/types';
import OptionsMenu from '../../misc/OptionsMenu';
import BreadCrumbs from '../../misc/BreadCrumbs';
import {FlashList} from '@shopify/flash-list';
import FlashlistTest from '../../misc/FlashlistTest';

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
  const selectedIndex = useSharedValue<number>(0);

  return (
    <View style={[styles.root]}>
      <Appbar />
      <BreadCrumbs />
      <SearchBar />

      <FAB parentComponentId={componentId} />
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
