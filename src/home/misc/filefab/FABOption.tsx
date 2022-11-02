import {StyleSheet, Dimensions, Pressable, Image} from 'react-native';
import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import emitter from '../../../utils/emitter';
import {pickMultiple} from 'react-native-document-picker';
import {
  Navigation,
  OptionsModalPresentationStyle,
} from 'react-native-navigation';
import {Modals} from '../../../navigation/screens/modals';
import notifee from '@notifee/react-native';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {UploadRequest} from '../../../shared/types';
import {UpdateFolderEvent} from '../../types';
import {NavigationContext} from '../../../navigation/NavigationContextProvider';

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
  const componentId = useContext(NavigationContext);

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

    emitter.emit('press', 'camera');
  };

  const openDocumentPicker = async () => {
    // @ts-ignore
    const result = await pickMultiple({
      allowMultiSelection: true,
    });

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

    const request: UploadRequest = {
      to: '6355742c13cfe841481f223e',
      details: {},
    };

    const formData = new FormData();

    for (let file of result) {
      formData.append('files', {
        name: file.name,
        type: file.type,
        uri: file.uri,
      });

      request.details[file.name] = {
        pages: null,
        duration: null,
        audioSamples: null,
        dimensions: null,
      };

      if (file.type?.startsWith('image')) {
        await Image.getSize(file.uri, (w, h) => {
          request.details[file.name].dimensions = [w, h];
        });
      }
    }

    formData.append('request', JSON.stringify(request, null, 2));

    try {
      const res = await axiosInstance.post('/api/v1/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      emitter.emit(`${UpdateFolderEvent.ADD_FILE}-${componentId}`, res.data);

      await notifee.displayNotification({
        id: 'upload',
        title: 'Files uploded',
        body: 'Your files have been uploaded successfully',
        android: {
          channelId: 'kio',
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const openShareModal = () => {
    Navigation.showModal({
      component: {
        name: 'SM',
      },
    });
  };

  const createFolder = () => {
    Navigation.showModal({
      component: {
        name: Modals.CREATE_FOLDER_MODAL,
        options: {
          layout: {
            backgroundColor: 'transparent',
          },
          modalPresentationStyle:
            OptionsModalPresentationStyle.overCurrentContext,
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
