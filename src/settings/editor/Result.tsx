import {View, StyleSheet, KeyboardAvoidingView, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import FAB from '../../misc/filefab/FAB';
import SearchBar from '../../home/misc/SearchBar';
import Appbar from '../../home/misc/Appbar';
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

const SIZE = 140;
const {height} = Dimensions.get('window');

const Result: NavigationFunctionComponent<ResultProps> = ({
  uri,
  componentId,
}) => {
  const val = useSharedValue(0);

  const selectedIndex = useSharedValue<number>(0);
  const translateX = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(0);
  const scale = useSharedValue<number>(0);
  const borderRadius = useSharedValue<number>(10);
  const width = useSharedValue<number>(SIZE);
  const rHeight = useSharedValue<number>(SIZE);
  const x = useSharedValue<number>(-height);
  const y = useSharedValue<number>(-height);

  return (
    <View style={[styles.root]}>
      <Appbar parentComponentId={componentId} />
      <BreadCrumbs />
      <SearchBar />
      <ImageThumbnail
        index={0}
        pic={'file:///storage/sdcard0/Descargas/glaceon.jpg'}
        image={{id: '', name: ''} as File}
        selectedIndex={selectedIndex}
        rtranslateX={translateX}
        rtranslateY={translateY}
        rscale={scale}
        rBorderRadius={borderRadius}
        rHeight={rHeight}
        rWidth={width}
        rx={x}
        ry={y}
      />

      <ImageThumbnail
        index={1}
        pic={'file:///storage/sdcard0/Descargas/bigsur.jpg'}
        image={{id: '', name: ''} as File}
        selectedIndex={selectedIndex}
        rtranslateX={translateX}
        rtranslateY={translateY}
        rscale={scale}
        rBorderRadius={borderRadius}
        rHeight={rHeight}
        rWidth={width}
        rx={x}
        ry={y}
      />

      <FAB parentComponentId={componentId} />

      <PinchableImageReflection
        translateX={translateX}
        translateY={translateY}
        scale={scale}
        borderRadius={borderRadius}
        height={rHeight}
        width={width}
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
