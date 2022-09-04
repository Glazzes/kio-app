import {Text, StyleSheet, Pressable} from 'react-native';
import React, {useEffect} from 'react';
import {
  Navigation,
  NavigationFunctionComponent,
  OptionsModalPresentationStyle,
} from 'react-native-navigation';
import {Canvas, RoundedRect, Shadow} from '@shopify/react-native-skia';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {peekLast} from '../store/navigationStore';

type FileMenuProps = {
  x: number;
  y: number;
};

const actions: {icon: string; text: string}[] = [
  {icon: 'ios-arrow-forward', text: 'Open'},
  {icon: 'ios-information-circle', text: 'Details'},
  {icon: 'ios-heart', text: 'Favorite'},
  {icon: 'ios-pencil', text: 'Edit'},
  {icon: 'ios-copy-outline', text: 'Copy '},
  {icon: 'ios-cut', text: 'Cut'},
  {icon: 'ios-share-social', text: 'Share'},
  {icon: 'ios-cloud-download', text: 'Download'},
  {icon: 'ios-trash-outline', text: 'Delete'},
];

const PADDING = 15;
const WIDTH = 180;
const MENU_HEIGHT = 40 * actions.length + PADDING * 2;
const BORDER_RADIUS = 10;

const AnimatedPresable = Animated.createAnimatedComponent(Pressable);

const FileMenu: NavigationFunctionComponent<FileMenuProps> = ({
  componentId,
  x,
  y,
}) => {
  const scale = useSharedValue<number>(0);

  const rStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: y ?? 0,
      left: x ?? 0,
      transform: [{scale: scale.value}],
    };
  });

  const goBack = () => {
    Navigation.dismissModal(componentId);
  };

  const close = () => {
    scale.value = withTiming(0, {duration: 150}, finished => {
      if (finished) {
        runOnJS(goBack)();
      }
    });
  };

  const showDetails = () => {
    scale.value = withTiming(0, undefined, finished => {
      if (finished) {
        runOnJS(closeAndOpenDrawer)();
      }
    });
  };

  const closeAndOpenDrawer = () => {
    Navigation.dismissModal(componentId);

    const lastFolderScreen = peekLast();
    Navigation.mergeOptions(lastFolderScreen.componentId, {
      sideMenu: {
        right: {
          visible: true,
        },
      },
    });
  };

  useEffect(() => {
    scale.value = withDelay(
      50,
      withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Pressable style={styles.root} onPress={close}>
      <AnimatedPresable style={[styles.menu, rStyle]}>
        <Canvas style={styles.canvas}>
          <RoundedRect
            x={PADDING}
            y={PADDING}
            width={WIDTH}
            height={MENU_HEIGHT}
            r={BORDER_RADIUS}
            color={'#fff'}>
            <Shadow dx={13} dy={13} blur={13} color={'rgba(0, 0, 0, 0.1)'} />
          </RoundedRect>
        </Canvas>
        <Pressable style={styles.closeButton} onPress={close} hitSlop={50}>
          <Icon color={'#000'} size={20} name={'close'} />
        </Pressable>
        {actions.map((action, index) => {
          return (
            <Pressable
              onPress={showDetails}
              key={`${action.text}-${index}`}
              style={styles.actionContainer}>
              <Icon
                size={25}
                color={action.icon === 'ios-trash-outline' ? '#ee3060' : '#000'}
                name={action.icon}
                style={styles.icon}
              />
              <Text
                style={
                  action.icon === 'ios-trash-outline'
                    ? styles.deleteText
                    : styles.actionText
                }>
                {action.text}
              </Text>
            </Pressable>
          );
        })}
      </AnimatedPresable>
    </Pressable>
  );
};

FileMenu.options = {
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
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: PADDING / 2,
    top: PADDING / 2,
  },
  menu: {
    width: WIDTH,
    height: MENU_HEIGHT,
    borderRadius: BORDER_RADIUS,
    padding: PADDING,
    paddingTop: PADDING + 7.5,
    backgroundColor: '#fff',
  },
  canvas: {
    position: 'absolute',
    top: -PADDING,
    left: -PADDING,
    width: WIDTH + 50,
    height: MENU_HEIGHT + 60,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    height: 30,
  },
  icon: {
    marginRight: 15,
  },
  actionText: {
    fontFamily: 'Uber',
    color: '#000',
  },
  deleteText: {
    fontFamily: 'Uber',
    color: '#ee3060',
  },
});

export default FileMenu;
