import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import React, {useContext} from 'react';
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
import emitter from '../../../utils/emitter';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationContext} from '../../../navigation/NavigationContextProvider';
import UserAvatar from './UserAvatar';
import {Modals} from '../../../navigation/screens/modals';
import {useSnapshot} from 'valtio';
import authState from '../../../store/authStore';
import {FileDeleteRequest} from '../../../shared/requests/types';
import {
  clearSelection,
  fileSelectionState,
  toggleSelectionLock,
} from '../../../store/fileSelection';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {host} from '../../../shared/constants';
import {displayToast} from '../../../shared/navigation/displayToast';
import {Notification} from '../../../enums/notification';
import {navigationState} from '../../../store/navigationStore';

type AppbarProps = {
  folderId?: string;
  scrollY: Animated.SharedValue<number>;
};

const {statusBarHeight} = Navigation.constantsSync();
const {width} = Dimensions.get('window');

const CANVAS_SIZE = statusBarHeight * 3 + 60;

const Appbar: React.FC<AppbarProps> = ({scrollY}) => {
  const user = useSnapshot(authState.user);
  const navigation = useSnapshot(navigationState);
  const selection = useSnapshot(fileSelectionState);

  const contentCount = selection.locked
    ? 0
    : selection.files.length + selection.folders.length;

  const componentId = useContext(NavigationContext);

  const clear = () => {
    emitter.emit(`clear-selection-${componentId}`);
  };

  const goBack = () => {
    Navigation.pop(componentId);
  };

  const copyCutSelection = () => {
    clear();
    toggleSelectionLock();
    Navigation.showOverlay({
      component: {
        name: 'Copy',
      },
    });
  };

  const downloadSelection = () => {
    Navigation.showModal({
      component: {
        name: Modals.GENERIC_DIALOG,
        passProps: {
          title: 'Download selection',
          message: `${contentCount} files will be downloaded, this may take a while`,
        },
      },
    });
  };

  const deleteSelection = async () => {
    const deleteRequest: FileDeleteRequest = {
      from: '6355742c13cfe841481f223e',
      files: selection.files.map(f => f.id),
    };

    try {
      await axiosInstance.delete(`${host}/api/v1/files`, {
        data: deleteRequest,
      });

      clear();
      clearSelection();
    } catch (e) {
      displayToast(
        'Delete file error',
        `Could not delete ${contentCount} files`,
        Notification.ERROR,
      );
    }
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
            {navigation.folders.length <= 1 ? (
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
                <View>
                  <Text style={[styles.title, {textAlign: 'center'}]}>
                    Music
                  </Text>
                  <Text style={styles.subTitle}>20 files, 2 folders</Text>
                </View>
                <UserAvatar />
              </View>
            )}
          </View>
          <View style={styles.appbar}>
            <View style={styles.countContainer}>
              <Pressable onPress={clear} hitSlop={20}>
                <Icon name={'close'} size={23} color={'#000'} />
              </Pressable>
              <Text style={styles.count}>{contentCount}</Text>
            </View>
            <View style={styles.countContainer}>
              <Pressable onPress={copyCutSelection}>
                <Icon
                  name={'ios-copy-outline'}
                  size={23}
                  color={'#000'}
                  style={styles.icon}
                />
              </Pressable>

              <Pressable onPress={copyCutSelection}>
                <Icon
                  name={'ios-cut-outline'}
                  size={23}
                  color={'#000'}
                  style={styles.icon}
                />
              </Pressable>

              <Pressable onPress={downloadSelection}>
                <Icon
                  name={'ios-cloud-download-outline'}
                  size={23}
                  color={'#000'}
                  style={styles.icon}
                />
              </Pressable>

              <Pressable onPress={deleteSelection}>
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
    fontSize: 17,
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
});

export default Appbar;
