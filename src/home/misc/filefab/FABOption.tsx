import {StyleSheet, Dimensions, Pressable} from 'react-native';
import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import emitter, {
  emitFolderAddFiles,
  emitFolderUpdatePreview,
} from '../../../utils/emitter';
import {pickMultiple} from 'react-native-document-picker';
import {Navigation} from 'react-native-navigation';
import {Modals} from '../../../navigation/screens/modals';
import notifee from '@notifee/react-native';
import {NavigationContext} from '../../../navigation/NavigationContextProvider';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {UpdateFolderEvent} from '../../utils/types';
import {uploadAudioFile} from '../../utils/functions/uploadAudioFile';
import {getFileFormData} from '../../utils/functions/getFileFormData';
import {Screens} from '../../../enums/screens';
import {apiFilesUrl} from '../../../shared/requests/contants';
import {useSnapshot} from 'valtio';
import {navigationState} from '../../../store/navigationStore';

type FABOptionProps = {
  action: {icon: string; angle: number};
  progress: Animated.SharedValue<number>;
  toggle: () => void;
};

const {width: windowWidth} = Dimensions.get('window');
const BUTTON_RADIUS = 40;
const CENTER = windowWidth / 2 - BUTTON_RADIUS;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FABOption: React.FC<FABOptionProps> = ({action, progress, toggle}) => {
  const navigation = useSnapshot(navigationState);
  const {folder, componentId} = useContext(NavigationContext);

  const onPress = async () => {
    toggle();

    if (action.icon === 'file') {
      await openDocumentPicker();
      return;
    }

    if (action.icon === 'folder') {
      createFolder();
      return;
    }

    if (action.icon === 'account') {
      openShareModal();
      return;
    }

    if (folder) {
      Navigation.push(componentId, {
        component: {
          name: Screens.CAMERA,
          passProps: {
            singlePicture: false,
            folderId: folder.id,
          },
        },
      });
    }
  };

  const openDocumentPicker = async () => {
    // @ts-ignore
    const result = await pickMultiple({
      allowMultiSelection: true,
      copyTo: 'cachesDirectory',
    });

    const files = result.filter(r => !r.type?.startsWith('audio'));
    const audioFiles = result.filter(
      r => r.type?.startsWith('audio') && !r.name.includes('.'),
    );

    audioFiles.forEach(audioFile => uploadAudioFile(folder?.id!!, audioFile));

    const formData = await getFileFormData(folder?.id!!, files);

    await notifee.displayNotification({
      id: 'upload',
      title: `Uploading file${result.length > 1 ? 's' : ''}`,
      body: 'this may take a while',
      android: {
        channelId: 'kio',
        progress: {
          current: 1,
          indeterminate: true,
          max: 100,
        },
      },
    });

    try {
      if (files.length > 0) {
        const {data} = await axiosInstance.post(apiFilesUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        emitFolderAddFiles(folder?.id!!, data);

        const prevFolder = navigation.folders[navigation.folders.length - 2];
        if (prevFolder) {
          console.log(prevFolder.folder.id, folder?.id);
          emitFolderUpdatePreview(
            prevFolder.folder.id,
            folder?.id,
            data.length,
            0,
          );
        }

        await notifee.displayNotification({
          id: 'upload',
          title: 'Files uploded',
          body: 'Your files have been uploaded successfully',
          android: {
            channelId: 'kio',
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const openShareModal = () => {
    Navigation.showModal({
      component: {
        name: Modals.SHARE,
      },
    });
  };

  const createFolder = () => {
    Navigation.showModal({
      component: {
        name: Modals.CREATE_FOLDER,
        passProps: {
          folderId: folder?.id!!,
        },
      },
    });
  };

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: CENTER * Math.cos(action.angle) * progress.value,
        },
        {
          translateY: CENTER * -1 * Math.sin(action.angle) * progress.value,
        },
      ],
    };
  });

  return (
    <AnimatedPressable style={[styles.button, rStyle]} onPress={onPress}>
      <Icon name={action.icon} color={'#fff'} size={20} />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: BUTTON_RADIUS,
    height: BUTTON_RADIUS,
    borderRadius: BUTTON_RADIUS / 2,
    backgroundColor: '#3366ff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: -1,
  },
});

export default React.memo(FABOption);
