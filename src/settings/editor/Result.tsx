import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import FAB from '../../misc/filefab/FAB';
import SearchBar from '../../home/misc/SearchBar';
import Appbar from '../../home/misc/Appbar';
import FileWrapper from '../../misc/FileWrapper';
import ImageThumbnail from '../../home/files/thumnnails/ImageThumbnail';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {File} from '../../utils/types';
import OptionsMenu from '../../misc/OptionsMenu';
import BreadCrumbs from '../../misc/BreadCrumbs';
import FolderList from '../../misc/FolderList';
import FolderSkeleton from '../../misc/skeleton/FolderSkeleton';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FolderListSkeleton from '../../misc/skeleton/FolderListSkeleton';
import Contributors from '../../misc/Contributors';
import PinchableImageReflection from '../../home/files/thumnnails/PinchableImageReflection';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

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
  const tx = useSharedValue(0);
  const off = useSharedValue(0);

  const scale = useSharedValue(1);
  const h = useSharedValue(100);
  const w = useSharedValue(100);

  const pan = Gesture.Pinch()
    .hitSlop({vertical: 50, horizontal: 50})
    .onStart(e => {
      off.value = tx.value;
    })
    .onChange(e => {
      scale.value = e.scale;
      h.value = interpolate(scale.value, [1, 3], [100, 400]);
      w.value = interpolate(scale.value, [1, 3], [100, 200]);
    })
    .onEnd(_ => {
      scale.value = withTiming(1);
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      width: w.value,
      height: h.value,
      transform: [{scale: scale.value}],
      backgroundColor: 'tomato',
    };
  });

  return (
    <View style={[styles.root]}>
      <GestureDetector gesture={pan}>
        <Animated.View style={rStyle}>
          <Image
            style={{flex: 1}}
            source={{uri: 'file:///storage/sdcard0/Descargas/glaceon.jpg'}}
            resizeMethod={'scale'}
          />
        </Animated.View>
      </GestureDetector>
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
    justifyContent: 'center',
  },
  box: {
    height: 100,
    width: 100,
    backgroundColor: 'orange',
  },
});

export default Result;
