import {StyleSheet, Dimensions, Pressable} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import emitter from '../../utils/emitter';
import Sound from 'react-native-sound';
import {pickMultiple} from 'react-native-document-picker';
import {FFprobeKit} from 'ffmpeg-kit-react-native';
import useUploadStore from '../../store/uploadUtil';

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
  const pushFile = useUploadStore(s => s.pushFile);
  const setFilesToUpload = useUploadStore(s => s.setFilesToUpload);

  const openDocumentPicker = async () => {
    // @ts-ignore
    const result = await pickMultiple({
      allowMultiSelection: true,
      copyTo: 'documentDirectory',
    });

    setFilesToUpload(result.length);

    for (let file of result) {
      let mediaLogs: String[] = [];
      await FFprobeKit.executeAsync(
        `-v error -show_entries stream=width,height,duration -of json ${result[0].fileCopyUri}`,
        undefined,
        logs => {
          mediaLogs.push(logs.getMessage());
        },
      );

      // FFProbes takes a long time to print the required info
      const timeout = setTimeout(() => {
        const ffProbeLogData = JSON.parse(mediaLogs.join(''))['streams'][0];
        const width: number | undefined = ffProbeLogData.width;
        const height: number | undefined = ffProbeLogData.height;
        let duration: string | undefined = ffProbeLogData.duration;

        let realDuration: number | undefined;
        if (duration) {
          realDuration = Math.floor(parseFloat(duration));
        }

        pushFile({
          file: {
            name: file.name,
            filename: file.name,
            fileType: file.type ?? '',
            uri: file.fileCopyUri ?? '',
          },
          metadata: {
            width,
            height,
            duration: realDuration,
          },
        });

        clearTimeout(timeout);
      }, 1000);
    }
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

  const onPress = async () => {
    toggle();
    if (action.icon === 'file') {
      await openDocumentPicker();
      return;
    }
    emitter.emit('press', 'camera');
  };

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
