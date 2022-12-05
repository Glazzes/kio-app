import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Navigation} from 'react-native-navigation';
import SearchBar from './SearchBar';
import {
  BlurMask,
  Canvas,
  Rect,
  useSharedValueEffect,
  useValue,
} from '@shopify/react-native-skia';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import emitter, {
  emitClearSelection,
  getFolderUpdatePreviewEventName,
} from '../../../../shared/emitter';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationContext} from '../../../../navigation/NavigationContextProvider';
import UserAvatar from './UserAvatar';
import {Modals} from '../../../../navigation/screens/modals';
import {useSnapshot} from 'valtio';
import authState from '../../../../store/authStore';
import {
  clearFileSelection,
  fileSelectionState,
  toggleSelectionLock,
} from '../../../../store/fileSelection';
import {CopyType} from '../../../../shared/enums';
import {File, Folder} from '../../../../shared/types';
import {Screens} from '../../../../enums/screens';
import {donwloadSelection} from '../utils/downloadSelection';
import {deleteSelection} from '../utils/deleteSelection';
import {displayGenericModal} from '../../../../shared/functions/navigation/displayGenericModal';

type AppbarProps = {
  scrollY: Animated.SharedValue<number>;
};

const {statusBarHeight} = Navigation.constantsSync();
const {width} = Dimensions.get('window');

const CANVAS_SIZE = statusBarHeight * 3 + 60;

const Appbar: React.FC<AppbarProps> = ({scrollY}) => {
  const user = useSnapshot(authState.user);
  const selection = useSnapshot(fileSelectionState);

  const {componentId, folder: currentFolder} = useContext(NavigationContext);
  const [folder, setFolder] = useState<Folder | undefined>(currentFolder);
  const isRoot = useRef<boolean>(componentId === Screens.MY_UNIT);

  const contentCount = selection.locked
    ? 0
    : selection.files.length + selection.folders.length;

  const sendEventAndClearSelection = () => {
    clear();
    clearFileSelection();
  };

  const clear = () => {
    emitClearSelection(folder?.id!!);
  };

  const goBack = () => {
    Navigation.pop(componentId);
  };

  const copyCutSelection = (type: CopyType) => {
    clear();
    toggleSelectionLock();
    Navigation.showOverlay({
      component: {
        name: Modals.COPY,
        passProps: {
          copyType: type,
        },
      },
    });
  };

  const downloadUserSelection = () => {
    donwloadSelection(selection.files as File[], selection.folders as Folder[]);
    sendEventAndClearSelection();
  };

  const openDeleteSelectionModal = () => {
    const action = () =>
      deleteSelection(
        selection.source!!,
        selection.files as File[],
        selection.folders as Folder[],
      );

    displayGenericModal({
      title: 'Delete selection',
      message:
        'Are you sure you want to delete these files? This action can not be undone',
      action,
    });
  };

  const opacity = useValue(0);
  const translateY = useSharedValue<number>(0);

  const rStyle = useAnimatedStyle(() => {
    return {transform: [{translateY: translateY.value}]};
  });

  useSharedValueEffect(() => {
    opacity.current = interpolate(
      scrollY.value,
      [0, 50],
      [0, 1],
      Extrapolate.CLAMP,
    );
  }, scrollY);

  useAnimatedReaction(
    () => contentCount,
    value => {
      translateY.value = withTiming(value > 0 ? -statusBarHeight * 2 : 0);
    },
  );

  useEffect(() => {
    const eventName = getFolderUpdatePreviewEventName(currentFolder?.id ?? '');
    const subscription = emitter.addListener(
      eventName,
      (files: number, folders: number) => {
        setFolder(_ => {
          if (currentFolder) {
            const copy = {...currentFolder};
            copy.summary.files = Math.max(0, copy.summary.files + files);
            copy.summary.folders = Math.max(0, copy.summary.folders + folders);
            return copy;
          }
        });
      },
    );

    if (currentFolder) {
      setFolder(currentFolder);
    }

    return () => subscription.remove();
  }, [currentFolder]);

  return (
    <Animated.View style={styles.root}>
      <Canvas style={styles.canvas}>
        <Rect
          x={0}
          y={CANVAS_SIZE - 72}
          width={width}
          height={50}
          color={'#0b4199'}
          opacity={opacity}>
          <BlurMask blur={18} style={'normal'} />
        </Rect>
        <Rect x={0} y={0} width={width} height={CANVAS_SIZE} color={'#fff'} />
      </Canvas>

      <View style={styles.appbarContainer}>
        <Animated.View style={rStyle}>
          <View style={styles.appbar}>
            {isRoot.current ? (
              <View style={styles.appbarContent}>
                <View>
                  <Text style={styles.hi}>Hi,</Text>
                  <Text style={styles.title}>{user.username}</Text>
                </View>
                <UserAvatar />
              </View>
            ) : (
              <View style={styles.appbarContent}>
                <Pressable hitSlop={20} onPress={goBack}>
                  <Icon name={'ios-arrow-back'} color={'#000'} size={22} />
                </Pressable>
                <View style={styles.center}>
                  <Text style={[styles.title, styles.align]}>
                    {folder?.name}
                  </Text>
                  {(folder?.summary.files ?? 0) +
                    (folder?.summary.folders ?? 0) ===
                  0 ? (
                    <Text style={styles.subTitle}>Currently empty</Text>
                  ) : (
                    <Text style={styles.subTitle}>
                      {(folder?.summary.files ?? 0) > 0 && (
                        <Text>
                          {folder?.summary.files} file
                          {(folder?.summary.files ?? 0) > 1 ? 's' : ''}
                        </Text>
                      )}

                      {(folder?.summary.folders ?? 0) > 0 && (
                        <Text>
                          {folder?.summary.files ?? 0 ? ', ' : ''}
                          {folder?.summary.folders} folder
                          {(folder?.summary.folders ?? 0) > 1 ? 's' : ''}
                        </Text>
                      )}
                    </Text>
                  )}
                </View>
                <UserAvatar />
              </View>
            )}
          </View>
          <View style={styles.appbar}>
            <View style={styles.countContainer}>
              <Pressable onPress={sendEventAndClearSelection} hitSlop={20}>
                <Icon name={'close'} size={23} color={'#000'} />
              </Pressable>
              <Text style={styles.count}>{contentCount}</Text>
            </View>
            <View style={styles.countContainer}>
              <Pressable onPress={() => copyCutSelection(CopyType.COPY)}>
                <Icon
                  name={'ios-copy-outline'}
                  size={23}
                  color={'#000'}
                  style={styles.icon}
                />
              </Pressable>

              <Pressable onPress={() => copyCutSelection(CopyType.CUT)}>
                <Icon
                  name={'ios-cut-outline'}
                  size={23}
                  color={'#000'}
                  style={styles.icon}
                />
              </Pressable>

              <Pressable onPress={downloadUserSelection}>
                <Icon
                  name={'ios-cloud-download-outline'}
                  size={23}
                  color={'#000'}
                  style={styles.icon}
                />
              </Pressable>

              <Pressable onPress={openDeleteSelectionModal}>
                <Icon
                  name={'ios-trash-outline'}
                  size={23}
                  color={'#ee3060'}
                  style={styles.icon}
                />
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </View>

      <SearchBar />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: width,
    paddingTop: statusBarHeight,
  },
  appbarContainer: {
    height: statusBarHeight * 2,
    overflow: 'hidden',
  },
  appbar: {
    width,
    paddingHorizontal: width * 0.05,
    height: statusBarHeight * 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appbarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hi: {
    fontFamily: 'Uber',
    color: '#000',
  },
  subTitle: {
    fontFamily: 'UberBold',
    fontSize: 12,
  },
  title: {
    fontFamily: 'UberBold',
    fontSize: 15,
    color: '#000',
    textTransform: 'capitalize',
  },
  canvas: {
    position: 'absolute',
    height: CANVAS_SIZE + 25,
    width,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    fontFamily: 'UberBold',
    color: '#000',
    fontSize: 17,
    marginLeft: 20,
  },
  icon: {
    marginLeft: 20,
  },
  center: {
    alignItems: 'center',
  },
  align: {
    textAlign: 'center',
  },
});

export default Appbar;
