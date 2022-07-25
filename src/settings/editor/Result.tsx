import {View, StyleSheet, KeyboardAvoidingView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import FAB from '../../misc/filefab/FAB';
import SearchBar from '../../misc/SearchBar';
import Appbar from '../../misc/Appbar';
import FileWrapper from '../../misc/FileWrapper';
import ImageThumbnail from '../../home/files/thumnnails/ImageThumbnail';
import {useSharedValue} from 'react-native-reanimated';
import {File} from '../../utils/types';
import OptionsMenu from '../../misc/OptionsMenu';
import BreadCrumbs from '../../misc/BreadCrumbs';
import FolderList from '../../misc/FolderList';
import FolderSkeleton from '../../misc/skeleton/FolderSkeleton';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FolderListSkeleton from '../../misc/skeleton/FolderListSkeleton';
import Contributors from '../../misc/Contributors';

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

  return (
    <KeyboardAvoidingView style={[styles.root]} behavior={'height'}>
      <Appbar parentComponentId={componentId} />
      <BreadCrumbs />
      <SearchBar />
      <Contributors />
      <FolderList />

      <FAB parentComponentId={componentId} />
    </KeyboardAvoidingView>
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
