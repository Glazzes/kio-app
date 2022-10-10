import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import emitter from '../utils/emitter';
import {Overlays} from '../shared/enum/Overlays';
import {Modals} from '../navigation/screens/modals';
import {File} from '../shared/types';

type FileDetailsAppbarProps = {
  file: File;
  parentComponentId: string;
  isVideo: boolean;
  isModal: boolean;
};

const {width} = Dimensions.get('window');

const {statusBarHeight} = Navigation.constantsSync();

const FileDetailsAppbar: React.FC<FileDetailsAppbarProps> = ({
  parentComponentId,
  isVideo,
  isModal,
  file,
}) => {
  const isHidden = useRef<boolean>(false);
  const ref = useRef<View>();

  const translateY = useSharedValue<number>(0);
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  const pop = () => {
    if (isModal) {
      emitter.emit('dis');
    }

    Navigation.pop(parentComponentId);
  };

  const openPIP = () => {
    if (isVideo) {
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
    const listener = emitter.addListener('st', () => {
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
        {isVideo && (
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
          ref={ref as any}
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
    width: 25,
    height: 25,
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
    paddingRight: 20,
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
    marginRight: 10,
  },
});

export default FileDetailsAppbar;
