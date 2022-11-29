import {
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  View,
  SectionList,
  SectionListRenderItemInfo,
  SectionListData,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  Navigation,
  NavigationFunctionComponent,
  OptionsModalPresentationStyle,
} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withTiming,
  withDecay,
  withSpring,
  useAnimatedReaction,
  scrollTo,
  useAnimatedRef,
} from 'react-native-reanimated';
import {peekLastNavigationScreen} from '../../store/navigationStore';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {clamp} from '../../shared/functions/clamp';
import {snapPoint} from 'react-native-redash';
import emitter, {emitFolderDeleteFolders} from '../../shared/emitter';
import {Modals} from '../../navigation/screens/modals';
import {Screens} from '../../enums/screens';
import {NotificationType} from '../../enums/notification';
import {File, Folder} from '../../shared/types';
import {getSimpleMimeType} from '../../shared/functions/getMimeType';
import {MimeType} from '../../shared/enum/MimeType';
import {pushToScreen} from '../../shared/functions/navigation/pushToScreen';
import {deleteFiles} from '../../shared/requests/functions/deleteFiles';
import {UpdateFolderEvent} from '../../home/utils/types';
import {deleteFolder} from '../../shared/functions/deleteFolder';
import {downloadFile} from '../../shared/requests/functions/downloadFile';
import {downloadFolder} from '../../shared/requests/functions/downloadFolder';
import {
  deleteFolderErrorMessage,
  deleteFolderSuccessMessage,
  displayToast,
} from '../../shared/toast';
import {shareFile} from '../utils/share';
import {copyLinkToClipboard} from '../utils/copyToClipboard';

type FileOptionSheetProps = {
  parentFolderId: string;
  file: File | Folder;
};

type Action = {
  icon: string;
  text: string;
};

const sections: {title: string; data: Action[]}[] = [
  {
    title: 'General',
    data: [
      {icon: 'ios-arrow-forward', text: 'Open'},
      {icon: 'ios-information-circle', text: 'Details'},
      {icon: 'ios-cloud-download', text: 'Download'},
    ],
  },
  {
    title: 'Modify',
    data: [
      {icon: 'ios-heart', text: 'Favorite'},
      {icon: 'ios-create', text: 'Rename'},
    ],
  },
  {
    title: 'Copy',
    data: [
      {icon: 'ios-copy', text: 'Copy '},
      {icon: 'ios-cut', text: 'Cut'},
    ],
  },
  {
    title: 'Social',
    data: [
      {icon: 'ios-link-outline', text: 'Copy link'},
      {icon: 'ios-share-social', text: 'Share'},
    ],
  },
  {
    title: 'Danger zone',
    data: [{icon: 'ios-trash', text: 'Delete'}],
  },
];

const {width, height} = Dimensions.get('window');
const BORDER_RADIUS = 10;

const estimatedSheetHeight = 30 * 10 + 10 * 14 + 50;

// const AnimatedPresable = Animated.createAnimatedComponent(Pressable);
const {statusBarHeight} = Navigation.constantsSync();

function renderItem(info: SectionListRenderItemInfo<Action>) {
  const color = {
    color: info.item.text === 'Delete' ? '#ee3060' : '#000',
  };

  return (
    <Pressable
      style={styles.actionContainer}
      onPress={() => emitter.emit('bs', info.item.text)}>
      <Icon
        name={info.item.icon}
        color={info.item.text === 'Delete' ? '#ee3060' : '#aaa'}
        size={22}
        style={styles.icon}
      />
      <Text style={[styles.actionText, color]}>{info.item.text}</Text>
    </Pressable>
  );
}

function renderSectionHeader(info: SectionListData<Action>) {
  return <Text style={styles.sectionTitle}>{info.section.title}</Text>;
}

function sectionSeparator() {
  return <View style={styles.separator} />;
}

const FileOptionSheet: NavigationFunctionComponent<FileOptionSheetProps> = ({
  componentId,
  parentFolderId,
  file,
}) => {
  const aRef = useAnimatedRef<SectionList>();
  const isFile = (file as File).contentType !== undefined;

  const close = (text: string) => {
    backgroundColor.value = withTiming('transparent');
    translateY.value = withTiming(height, {duration: 450}, finished => {
      if (finished) {
        runOnJS(performAction)(text);
      }
    });
  };

  const defineIcon = () => {
    let icon = 'ios-folder-open';
    if (!isFile) {
      return icon;
    }

    const mimeType = getSimpleMimeType((file as File).contentType);
    switch (mimeType) {
      case MimeType.AUDIO:
        icon = 'ios-headset';
        break;

      case MimeType.VIDEO:
        icon = 'ios-film';
        break;

      case MimeType.PDF:
        icon = 'ios-book';
        break;

      case MimeType.IMAGE:
        icon = 'ios-image';
        break;

      default:
        icon = 'ios-document';
    }

    return icon;
  };

  const performAction = (text: string) => {
    dissmiss();

    switch (text) {
      case 'Open':
        open();
        return;

      case 'Details':
        openDetails();
        return;

      case 'Copy link':
        copyLink();
        return;

      case 'Favorite':
        faveFile();
        return;

      case 'Download':
        download();
        return;

      case 'Delete':
        openDeleteModal();
        return;

      case 'Share':
        shareFile(file);
        return;

      case 'Copy link':
        copyLinkToClipboard(file);
        return;

      default:
        return;
    }
  };

  const open = () => {
    const {componentId: lastComponentId} = peekLastNavigationScreen();
    if (!isFile) {
      Navigation.push(lastComponentId, {
        component: {
          name: Screens.MY_UNIT,
          passProps: {
            folder: file,
          },
        },
      });

      return;
    }

    const mimeType = getSimpleMimeType((file as File).contentType);
    switch (mimeType) {
      case MimeType.AUDIO:
        pushToScreen(lastComponentId, Screens.AUDIO_PLAYER, {file});
        return;

      case MimeType.VIDEO:
        pushToScreen(lastComponentId, Screens.VIDEO_PLAYER, {file});
        return;

      case MimeType.IMAGE:
        emitter.emit(`push-${file.id}-image`);
        return;

      case MimeType.PDF:
        pushToScreen(lastComponentId, Screens.PDF_READER, {file});
        return;

      default:
        pushToScreen(lastComponentId, Screens.GENERIC_DETAILS, {file});
        return;
    }
  };

  const openDetails = () => {
    const lastFolderScreen = peekLastNavigationScreen();

    Navigation.updateProps(Screens.FILE_DRAWER, {file});

    Navigation.mergeOptions(lastFolderScreen.componentId, {
      sideMenu: {
        right: {
          visible: true,
        },
      },
    });
  };

  const faveFile = () => {
    emitter.emit(`favorite-${file.id}`);
  };

  const download = () => {
    if (isFile) {
      downloadFile(file as File);
    } else {
      downloadFolder(file as Folder);
    }
  };

  const copyLink = () => {
    Navigation.showOverlay({
      component: {
        name: Screens.TOAST,
        passProps: {
          title: 'Link copied',
          message: 'Link has been copied to your clipboard.',
          type: NotificationType.INFO,
        },
      },
    });
  };

  const openDeleteModal = () => {
    Navigation.showModal({
      component: {
        name: Modals.GENERIC_DIALOG,
        passProps: {
          title: `Delete "${file.name}"`,
          message:
            'Are you sure you want to delete this file? This action can not be undone',
          action: deleteCurrentFile,
        },
      },
    });
  };

  const deleteCurrentFile = async () => {
    dissmiss();

    if (!isFile) {
      try {
        await deleteFolder(file.id);
        emitFolderDeleteFolders(parentFolderId, [file.id]);

        const message = deleteFolderSuccessMessage(file.name, 1);
        displayToast(message);
      } catch (e) {
        const message = deleteFolderErrorMessage(file.name, 1);
        displayToast(message);
      } finally {
        return;
      }
    }

    try {
      deleteFiles({
        from: parentFolderId,
        files: [file.id],
      });

      emitter.emit(`${UpdateFolderEvent.DELETE_FILES}-${parentFolderId}`, [
        file.id,
      ]);

      Navigation.showOverlay({
        component: {
          name: Screens.TOAST,
          passProps: {
            title: 'File deleted',
            message: 'The file has been successfully deleted',
            type: NotificationType.SUCCESS,
          },
        },
      });
    } catch (e) {
      Navigation.showOverlay({
        component: {
          name: Screens.TOAST,
          passProps: {
            title: 'File delete',
            message: 'Could not delete your file',
            type: NotificationType.ERROR,
          },
        },
      });
    }
  };

  const dissmiss = () => {
    Navigation.dismissModal(componentId);
  };

  const backgroundColor = useSharedValue<string>('transparent');
  const translateY = useSharedValue<number>(height);
  const offset = useSharedValue<number>(0);

  const translate = useDerivedValue<number>(() => {
    return clamp(translateY.value, 0, height);
  }, [translateY]);

  const scroll = useDerivedValue<number>(() => {
    return clamp(translateY.value, -225, height / 2);
  }, [translateY]);

  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.value = scroll.value;
    })
    .onChange(e => {
      translateY.value = e.translationY + offset.value;
    })
    .onEnd(({velocityY}) => {
      const snap = snapPoint(translateY.value, velocityY, [
        0,
        height / 2,
        height,
      ]);

      if (translateY.value < height / 2 || snap === 0) {
        translateY.value = withDecay({
          velocity: velocityY,
          clamp: [-estimatedSheetHeight, height / 2],
        });

        return;
      }

      if (snap === height) {
        backgroundColor.value = withTiming('transparent', {duration: 150});
        translateY.value = withTiming(snap, undefined, finished => {
          if (finished) {
            console.log('finished');
            runOnJS(dissmiss)();
          }
        });

        return;
      }

      if (snap === height / 2) {
        translateY.value = withSpring(snap);
        return;
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translate.value}],
    };
  });

  const rootStyles = useAnimatedStyle(() => {
    return {backgroundColor: backgroundColor.value};
  });

  useAnimatedReaction(
    () => scroll.value,
    y => {
      scrollTo(aRef, 0, -1 * y, false);
    },
  );

  useEffect(() => {
    backgroundColor.value = withTiming('rgba(0, 0, 0, 0.3)');
    translateY.value = withSpring(height / 2);

    const actionListener = emitter.addListener('bs', (text: string) => {
      close(text);
    });

    const backLisnter =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          if (buttonId === 'RNN.hardwareBackButton') {
            backgroundColor.value = withTiming('transparent', {duration: 150});
            translateY.value = withTiming(height, undefined, finished => {
              if (finished) {
                runOnJS(dissmiss)();
              }
            });
          }
        },
      );

    return () => {
      actionListener.remove();
      backLisnter.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.root, rootStyles]}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.menu, rStyle]}>
          <View style={styles.marker} />
          <View style={styles.header}>
            <Icon name={defineIcon()} color={'#000'} size={22} />
            <Text style={styles.title} numberOfLines={2} ellipsizeMode={'tail'}>
              {file.name}
            </Text>
          </View>
          <SectionList
            ref={aRef}
            sections={sections}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader as any}
            SectionSeparatorComponent={sectionSeparator}
            style={styles.content}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

FileOptionSheet.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
  layout: {
    backgroundColor: 'transparent',
  },
  modalPresentationStyle: OptionsModalPresentationStyle.overCurrentContext,
  hardwareBackButton: {
    dismissModalOnPress: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  marker: {
    backgroundColor: '#2C3639',
    height: 5,
    width: width * 0.25,
    borderRadius: BORDER_RADIUS,
    alignSelf: 'center',
    marginVertical: 10,
  },
  header: {
    width,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 10,
    paddingHorizontal: width * 0.05,
    borderBottomColor: '#000',
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
    marginHorizontal: 20,
    fontSize: 15,
  },
  sectionTitle: {
    fontFamily: 'UberBold',
    color: '#aaa',
    fontSize: 14,
  },
  content: {
    paddingHorizontal: width * 0.05,
  },
  menu: {
    width,
    height,
    borderTopRightRadius: BORDER_RADIUS,
    borderTopLeftRadius: BORDER_RADIUS,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#fff',
  },
  canvas: {
    position: 'absolute',
    top: -statusBarHeight,
    left: 0,
    width: width,
    height: height + statusBarHeight,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7.5,
    height: 30,
    marginLeft: 20,
  },
  icon: {
    marginRight: 20,
  },
  actionText: {
    fontFamily: 'UberBold',
    color: '#000',
  },
  deleteText: {
    fontFamily: 'UberBold',
    color: '#ee3060',
  },
  separator: {
    height: 15,
  },
});

export default FileOptionSheet;
