import {StyleSheet, Dimensions, Pressable} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import emitter from '../../utils/emitter';
import Sound from 'react-native-sound';
import {pickMultiple} from 'react-native-document-picker';
import {
  Navigation,
  OptionsModalPresentationStyle,
} from 'react-native-navigation';
import {Modals} from '../../navigation/Modals';

type FABOptionProps = {
  action: {icon: string; angle: number};
  progress: Animated.SharedValue<number>;
  toggle: () => void;
};

Sound.setCategory('Playback');

const {width: windowWidth} = Dimensions.get('window');
const BUTTON_RADIUS = 40;
const CENTER = windowWidth / 2 - BUTTON_RADIUS;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FABOption: React.FC<FABOptionProps> = ({action, progress, toggle}) => {
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

    emitter.emit('press', 'camera');
  };

  const openDocumentPicker = async () => {
    // @ts-ignore
    const result = await pickMultiple({
      allowMultiSelection: true,
      copyTo: 'cachesDirectory',
    });

    Navigation.showModal({
      component: {
        name: 'Generic',
        passProps: {
          title: 'Upload files',
          message:
            'This process may take a while depending on your internet connection, be patient',
        },
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
