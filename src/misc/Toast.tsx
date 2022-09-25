import {View, StyleSheet, Dimensions, Text, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {Notification} from '../enums/notification';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import emitter from '../utils/emitter';
import {Event} from '../enums/events';

type ToastInfo = {
  backgroundColor: string;
  progressColor: string;
  icon: string;
  status: string;
};

type Color = {
  [id: string]: ToastInfo;
};

type ToastProps = {
  title: string;
  message: string;
  type: Notification;
};

const {width} = Dimensions.get('window');

const information: Color = {
  [Notification.SUCCESS]: {
    backgroundColor: '#07c468',
    progressColor: '#A2ECC4',
    icon: 'check-circle',
    status: 'Success!',
  },
  [Notification.INFO]: {
    backgroundColor: '#0087D7',
    progressColor: '#81C3EB',
    icon: 'information',
    status: 'Info!',
  },
  [Notification.WARNING]: {
    backgroundColor: '#FFBC00',
    progressColor: '#FFDE81',
    icon: 'information',
    status: 'Warning!',
  },
  [Notification.ERROR]: {
    backgroundColor: '#F94415',
    progressColor: '#FCA48E',
    icon: 'plus-circle',
    status: 'Error!',
  },
};

const SPACING = 15;
const TOAST_WIDTH = width * 0.9;
const DURATION = 10000;

const Toast: NavigationFunctionComponent<ToastProps> = ({
  componentId,
  type,
  message,
  title,
}) => {
  const toastInfo = information[type];

  const [show, setShow] = useState<boolean>(true);
  const translateX = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(100);
  const [height, setHeight] = useState<number>(0);

  const containerStyles = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const rStyle = useAnimatedStyle(() => ({
    backgroundColor: toastInfo.progressColor,
    transform: [{translateX: translateX.value}],
  }));

  const dismiss = () => {
    setShow(false);
    Navigation.dismissOverlay(componentId);
    emitter.emit(Event.FAB_MOVE_DOWN);
  };

  const hide = () => {
    translateY.value = withTiming(100, undefined, finished => {
      if (finished) {
        runOnJS(dismiss)();
      }
    });
  };

  useEffect(() => {
    if (height !== 0) {
      emitter.emit(Event.FAB_MOVE_UP, height + 10);
    }
  }, [height]);

  useEffect(() => {
    translateY.value = withTiming(0);
    translateX.value = withTiming(
      -TOAST_WIDTH,
      {duration: DURATION, easing: Easing.linear},
      f => {
        if (f) {
          runOnJS(hide)();
        }
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (show) {
    return (
      <Animated.View
        onLayout={e => setHeight(e.nativeEvent.layout.height)}
        style={[
          containerStyles,
          styles.toast,
          {backgroundColor: toastInfo.backgroundColor},
        ]}>
        <View style={styles.content}>
          <Icon
            name={toastInfo.icon}
            size={30}
            color={'#fff'}
            style={[
              styles.icon,
              {
                transform: [
                  {rotate: type === Notification.ERROR ? '45deg' : '0deg'},
                ],
              },
            ]}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.textContent}>{message}</Text>
          </View>
          <Pressable style={styles.closeIcon} onPress={hide}>
            <Icon name={'plus'} color={'#fff'} size={25} />
          </Pressable>
        </View>
        <Animated.View style={[styles.progress, rStyle]} />
      </Animated.View>
    );
  }

  return null;
};

Toast.options = {
  overlay: {
    interceptTouchOutside: false,
  },
};

const styles = StyleSheet.create({
  toast: {
    width: TOAST_WIDTH,
    position: 'absolute',
    overflow: 'hidden',
    bottom: SPACING,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  icon: {
    alignSelf: 'center',
    margin: 5,
  },
  content: {
    flexDirection: 'row',
    padding: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  title: {
    color: '#fff',
    fontFamily: 'UberBold',
    fontSize: 15,
  },
  textContent: {
    color: '#fff',
    fontFamily: 'Uber',
  },
  closeIcon: {
    alignSelf: 'flex-start',
    transform: [{rotate: '45deg'}],
    marginLeft: 5,
  },
  progress: {
    height: 5,
    width: '100%',
  },
});

export default Toast;
