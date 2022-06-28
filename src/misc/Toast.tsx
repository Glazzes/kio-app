import {View, StyleSheet, Dimensions, Text, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {Notification} from '../enums/notification';
import Animated, {
  cancelAnimation,
  Keyframe,
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
  message: string;
  type: Notification;
};

const {width} = Dimensions.get('window');

const information: Color = {
  [Notification.SUCCESS]: {
    backgroundColor: '#41D888',
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
const DURATION = 6000;

const entering = new Keyframe({
  from: {
    transform: [{translateY: 100}],
  },
  to: {
    transform: [{translateY: 0}],
  },
});

const exiting = new Keyframe({
  from: {
    transform: [{translateY: 0}],
  },
  to: {
    transform: [{translateY: 100}],
  },
});

const Toast: NavigationFunctionComponent<ToastProps> = ({
  componentId,
  type,
  message,
}) => {
  const [show, setShow] = useState<boolean>(true);

  const toastInfo = information[type];
  const translateX = useSharedValue<number>(1);
  const [height, setHeight] = useState<number>(0);

  const rStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: toastInfo.progressColor,
      transform: [{translateX: translateX.value}],
    };
  });

  const hide = () => {
    emitter.emit(Event.FAB_MOVE_DOWN);
    setShow(false);
    cancelAnimation(translateX);
  };

  useEffect(() => {
    translateX.value = withTiming(-TOAST_WIDTH, {duration: DURATION}, f => {
      if (f) {
        runOnJS(hide)();
      }
    });

    const timeout = setTimeout(() => {
      Navigation.dismissOverlay(componentId);
    }, DURATION + 300);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (height !== 0) {
      emitter.emit(Event.FAB_MOVE_UP, height + 10);
    }
  }, [height]);

  if (show) {
    return (
      <Animated.View
        entering={entering.duration(300)}
        exiting={exiting.duration(300)}
        onLayout={e => setHeight(e.nativeEvent.layout.height)}
        style={[styles.toast, {backgroundColor: toastInfo.backgroundColor}]}>
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
            <Text style={styles.title}>{toastInfo.status}</Text>
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
    bottom: SPACING,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    overflow: 'hidden',
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
