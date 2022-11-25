import {
  Text,
  Dimensions,
  StyleSheet,
  LayoutChangeEvent,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import emitter, {
  emitFolderAddFiles,
  emitFolderAddFolders,
  emitFolderDeleteFiles,
  emitFolderDeleteFolders,
  emitFolderUpdatePreview,
} from '../../../utils/emitter';
import {Event} from '../../../enums/events';
import Icon from 'react-native-vector-icons/Ionicons';
import ModalWrapper from './ModalWrapper';
import {
  clearSelection,
  fileSelectionState,
  toggleSelectionLock,
} from '../../../store/fileSelection';
import {useSnapshot} from 'valtio';
import {
  navigationState,
  peekLastNavigationScreen,
} from '../../../store/navigationStore';
import {CopyType} from '../../../shared/enums';
import {CopyRequest} from '../../../shared/types';
import {cutSelection} from '../../../shared/requests/functions/cutSelection';
import {copySelection} from '../../../shared/requests/functions/copySelection';
import {
  copySelectionErrorMessage,
  copySelectionSuccessMessage,
  displayToast,
} from '../../../shared/toast';

type CopyModalProps = {
  copyType: CopyType;
};

const {width} = Dimensions.get('window');

const CopyModal: NavigationFunctionComponent<CopyModalProps> = ({
  componentId,
  copyType,
}) => {
  const navigation = useSnapshot(navigationState);
  const selection = useSnapshot(fileSelectionState);
  const [isCopying, setIsCopying] = useState<boolean>(false);

  const isMeasured = useRef<boolean>(false);

  const onLayout = ({
    nativeEvent: {
      layout: {height: h},
    },
  }: LayoutChangeEvent) => {
    if (!isMeasured.current) {
      emitter.emit(Event.FAB_MOVE_UP, h + 10);
      isMeasured.current = true;
    }
  };

  const dissmis = () => {
    Navigation.dismissOverlay(componentId);
  };

  const dissmisSelection = () => {
    clearSelection();
    toggleSelectionLock();
    emitter.emit(Event.FAB_MOVE_DOWN);

    translateY.value = withTiming(100, undefined, finished => {
      if (finished) {
        runOnJS(dissmis)();
      }
    });
  };

  const performSelection = async () => {
    const lastFolder = peekLastNavigationScreen().folder;

    const folderCopyRequest: CopyRequest = {
      from: selection.source!!,
      to: lastFolder.id,
      items: selection.folders.map(f => f.id),
    };

    const fileCopyRequest: CopyRequest = {
      from: selection.source!!,
      to: lastFolder.id,
      items: selection.files.map(f => f.id),
    };

    if (copyType === CopyType.COPY) {
      copy(fileCopyRequest, folderCopyRequest);
    } else {
      cut(fileCopyRequest, folderCopyRequest);
    }
  };

  const copy = async (fileRequest: CopyRequest, folderRequest: CopyRequest) => {
    try {
      if (folderRequest.items.length > 0) {
        const {data} = await copySelection(folderRequest, 'folders');
        emitFolderAddFolders(folderRequest.to, data);
        emitFolderUpdatePreview(folderRequest.to, 0, data.length);
      }

      if (fileRequest.items.length > 0) {
        const {data} = await copySelection(fileRequest, 'files');
        emitFolderAddFiles(fileRequest.to, data);
        emitFolderUpdatePreview(folderRequest.to, data.length, 0);
      }

      const message = copySelectionSuccessMessage('copy');
      displayToast(message);
    } catch (e) {
      const message = copySelectionErrorMessage();
      displayToast(message);
    } finally {
      dissmisSelection();
    }
  };

  const cut = async (fileRequest: CopyRequest, folderRequest: CopyRequest) => {
    try {
      if (folderRequest.items.length > 0) {
        const {data} = await cutSelection(folderRequest, 'folders');
        emitFolderAddFolders(folderRequest.to, data);
        emitFolderDeleteFolders(
          folderRequest.from,
          data.map(f => f.id),
        );

        emitFolderUpdatePreview(folderRequest.to, 0, data.length);
        emitFolderUpdatePreview(folderRequest.from, 0, -1 * data.length);
      }

      if (fileRequest.items.length > 0) {
        const {data} = await cutSelection(fileRequest, 'files');
        emitFolderAddFiles(fileRequest.to, data);
        emitFolderDeleteFiles(
          fileRequest.from,
          data.map(f => f.id),
        );

        emitFolderUpdatePreview(folderRequest.to, data.length, 0);
        emitFolderUpdatePreview(folderRequest.from, -1 * data.length, 0);
      }

      const message = copySelectionErrorMessage('copy');
      displayToast(message);
    } catch (e) {
      const message = copySelectionErrorMessage();
      displayToast(message);
    } finally {
      dissmisSelection();
    }
  };

  const translateY = useSharedValue<number>(100);
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  useEffect(() => {
    translateY.value = withTiming(0);

    const show = emitter.addListener('show', () => {
      translateY.value = withTiming(0);
    });

    const hide = emitter.addListener('hide', () => {
      translateY.value = withTiming(100);
    });

    return () => {
      show.remove();
      hide.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.root, rStyle]} onLayout={onLayout}>
      <ModalWrapper witdh={width * 0.9}>
        <View style={[styles.row, styles.spacer]}>
          <View>
            <Text style={styles.title}>
              {copyType === CopyType.CUT ? 'Cut' : 'Paste'} items in{' '}
              {`"${
                navigation.folders[navigation.folders.length - 1].folder.name
              }"`}
            </Text>
            <Text style={styles.subtitle}>
              {selection.folders.length > 0 && (
                <Text>{selection.folders.length} folders</Text>
              )}
              {selection.files.length > 0 && (
                <Text>
                  {selection.folders.length > 0 ? ' and ' : ''}
                  {selection.files.length} files
                </Text>
              )}
            </Text>
          </View>
          <View style={styles.row}>
            <Pressable onPress={dissmisSelection}>
              <Icon
                name={'ios-close-circle-outline'}
                size={30}
                color={'#000'}
                style={styles.icon}
              />
            </Pressable>
            <Pressable onPress={performSelection}>
              <Icon
                name={'ios-checkmark-circle-outline'}
                size={30}
                color={'#3366ff'}
              />
            </Pressable>
          </View>
        </View>
      </ModalWrapper>
    </Animated.View>
  );
};

CopyModal.options = {
  statusBar: {
    visible: true,
  },
  overlay: {
    interceptTouchOutside: false,
  },
};

const styles = StyleSheet.create({
  root: {
    width: width * 0.9,
    position: 'absolute',
    bottom: width * 0.05,
    marginHorizontal: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spacer: {
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
  },
  subtitle: {
    fontFamily: 'UberBold',
    fontSize: 12,
  },
  indicator: {
    height: 30,
    width: 30,
  },
});

export default CopyModal;
