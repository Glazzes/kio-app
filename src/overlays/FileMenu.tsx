import {Text, StyleSheet, Pressable, Dimensions, View} from 'react-native';
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
  dark: boolean;
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

const {width, height} = Dimensions.get('window');
const PADDING = width * 0.05;
const WIDTH = 180;
const MENU_HEIGHT = 40 * actions.length + PADDING * 2;
const BORDER_RADIUS = 10;

const AnimatedPresable = Animated.createAnimatedComponent(Pressable);

const FileMenu: NavigationFunctionComponent<FileMenuProps> = ({
  componentId,
  x,
  y,
  dark,
}) => {
  const scale = useSharedValue<number>(0);

  const rStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: dark ? '#1B2430' : '#fff',
      transform: [{scale: 1}, {translateX: height / 2}],
    };
  });

  const goBack = () => {
    Navigation.dismissModal(componentId);
  };

  const close = () => {
    Navigation.dismissModal(componentId);
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
      <View style={[styles.menu]}>
        <View style={styles.marker} />
        <View style={styles.header}>
          <Icon name={'ios-document'} size={25} color={'#000'} />
          <Text style={styles.title}>Glaceon.png</Text>
        </View>
        {actions.map((action, index) => {
          return (
            <Pressable
              onPress={showDetails}
              key={`${action.text}-${index}`}
              style={styles.actionContainer}>
              <Icon
                size={25}
                color={
                  action.icon === 'ios-trash-outline'
                    ? '#ee3060'
                    : dark
                    ? '#fff'
                    : '#000'
                }
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
      </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  marker: {
    backgroundColor: '#2C3639',
    height: 5,
    width: width * 0.25,
    borderRadius: 15,
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  header: {
    width,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderBottomColor: '#000',
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
    marginLeft: 20,
  },
  menu: {
    width,
    height,
    borderRadius: BORDER_RADIUS,
    padding: PADDING,
    paddingHorizontal: width * 0.1,
    transform: [{translateY: height * 0.25}],
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
    marginVertical: 10,
    height: 30,
  },
  icon: {
    marginRight: 20,
  },
  actionText: {
    fontFamily: 'UberBold',
    color: '#000',
  },
  deleteText: {
    fontFamily: 'UberBold',
    color: '#ee3060',
  },
});

export default FileMenu;
