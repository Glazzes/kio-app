import {View, StyleSheet, KeyboardAvoidingView, Dimensions} from 'react-native';
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
import PinchableImageReflection from '../../home/files/thumnnails/PinchableImageReflection';

type ResultProps = {
  uri?: string;
};

const {height} = Dimensions.get('window');

const Result: NavigationFunctionComponent<ResultProps> = ({
  uri,
  componentId,
}) => {
  const val = useSharedValue(0);

  const translateX = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(0);
  const scale = useSharedValue<number>(0);
  const borderRadius = useSharedValue<number>(10);
  const x = useSharedValue<number>(-height);
  const y = useSharedValue<number>(-height);

  return (
    <View style={[styles.root]}>
      <Appbar parentComponentId={componentId} />
      <BreadCrumbs />
      <SearchBar />
      <ImageThumbnail
        index={0}
        image={{id: '', name: ''} as File}
        selectedIndex={val}
        rtranslateX={translateX}
        rtranslateY={translateY}
        rscale={scale}
        rBorderRadius={borderRadius}
        rx={x}
        ry={y}
      />
      <FAB parentComponentId={componentId} />

      <PinchableImageReflection
        translateX={translateX}
        translateY={translateY}
        scale={scale}
        borderRadius={borderRadius}
        x={x}
        y={y}
      />
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
