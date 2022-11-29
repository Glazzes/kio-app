import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import emitter, {emitDissLastModal, hideAppbarEventName} from '../emitter';
import {Overlays} from '../enum/Overlays';
import {Modals} from '../../navigation/screens/modals';
import {File} from '../types';
import {shareFile} from '../../overlays/utils/share';

type FileDetailsAppbarProps = {
  file: File;
  parentComponentId: string;
  isVideoReadyForDisplay?: boolean;
  isModal: boolean;
};

const {width} = Dimensions.get('window');

const {statusBarHeight} = Navigation.constantsSync();

const FileDetailsAppbar: React.FC<FileDetailsAppbarProps> = ({
  parentComponentId,
  isModal,
  isVideoReadyForDisplay,
  file,
}) => {
  const isHidden = useRef<boolean>(false);

  const translateY = useSharedValue<number>(0);
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  const pop = () => {
    if (isModal) {
      emitDissLastModal();
      return;
    }

    Navigation.pop(parentComponentId);
  };

  const openPIP = () => {
    if (isVideoReadyForDisplay) {
      const tout = setTimeout(() => {
        Navigation.pop(parentComponentId);
        clearTimeout(tout);
      }, 1000);
    } else {
      Navigation.pop(parentComponentId);
    }

    Navigation.showOverlay({
      component: {
        name: Overlays.PICTURE_IN_PICTURE_VIDEO,
        passProps: {
          file,
        },
      },
    });
  };

  const openMenu = () => {
    Navigation.showOverlay({
      component: {
        name: Modals.FILE_MENU,
        passProps: {
          file,
        },
      },
    });
  };

  useEffect(() => {
    const listener = emitter.addListener(hideAppbarEventName, () => {
      translateY.value = withTiming(
        translateY.value === 0 ? -statusBarHeight * 3 : 0,
      );

      Navigation.mergeOptions(parentComponentId, {
        statusBar: {
          visible: isHidden.current,
        },
      });

      isHidden.current = !isHidden.current;
    });

    return () => {
      listener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.root, rStyle]}>
      <View style={styles.infoContainer}>
        <Pressable hitSlop={40} onPress={pop}>
          <Icon
            name={'ios-arrow-back'}
            size={22}
            color={'#fff'}
            style={styles.icon}
          />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
            {file.name}
          </Text>
        </View>
      </View>
      <View style={styles.leftContainer}>
        {isVideoReadyForDisplay && (
          <Pressable hitSlop={30} onPress={openPIP}>
            <Icon
              name={'ios-open-outline'}
              size={22}
              color={'#fff'}
              style={styles.pictureInPicture}
            />
          </Pressable>
        )}
        <Pressable
          onPress={() => shareFile(file)}
          style={({pressed}) => ({
            opacity: pressed ? 0.3 : 1,
            marginRight: width * 0.05,
          })}>
          <Icon name={'ios-share-social'} size={20} color={'#fff'} />
        </Pressable>
        <Pressable
          onPress={openMenu}
          style={({pressed}) => ({opacity: pressed ? 0.3 : 1})}>
          <Icon name={'ellipsis-vertical'} size={20} color={'#fff'} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    height: statusBarHeight * 3,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingTop: statusBarHeight,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingRight: width * 0.05,
  },
  title: {
    color: '#fff',
    fontFamily: 'Uber',
    fontSize: 17,
    marginLeft: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pictureInPicture: {
    marginRight: width * 0.05,
  },
});

export default FileDetailsAppbar;
