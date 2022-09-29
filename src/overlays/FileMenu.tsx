import {
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  View,
  ScrollView,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  Navigation,
  NavigationFunctionComponent,
  OptionsModalPresentationStyle,
} from 'react-native-navigation';
import {Canvas, RoundedRect, Shadow} from '@shopify/react-native-skia';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withTiming,
  withDecay,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import {peekLast} from '../store/navigationStore';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {clamp} from '../shared/functions/clamp';
import {snapPoint} from 'react-native-redash';

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
  {icon: 'ios-link-outline', text: 'Copy link'},
  {icon: 'ios-share-social', text: 'Share'},
  {icon: 'ios-cloud-download', text: 'Download'},
  {icon: 'ios-trash-outline', text: 'Delete'},
];

const {width, height} = Dimensions.get('window');
const BORDER_RADIUS = 10;

// const AnimatedPresable = Animated.createAnimatedComponent(Pressable);
const {statusBarHeight} = Navigation.constantsSync();

const FileMenu: NavigationFunctionComponent<FileMenuProps> = ({
  componentId,
  dark,
}) => {
  const dissmiss = () => {
    Navigation.dismissModal(componentId);
  };

  const showDetails = () => {
    translateY.value = withTiming(height, undefined, finished => {
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

  const translateY = useSharedValue<number>(height);
  const offset = useSharedValue<number>(0);

  const translate = useDerivedValue<number>(() => {
    return clamp(translateY.value, 0, height);
  }, [translateY]);

  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.value = translate.value;
    })
    .onChange(e => {
      translateY.value = e.translationY + offset.value;
    })
    .onEnd(({velocityY}) => {
      const snap = snapPoint(translateY.value, velocityY, [
        0,
        height / 2,
        height,
      ]);

      if (translateY.value < height / 2 || snap === 0) {
        translateY.value = withDecay({
          velocity: velocityY,
          clamp: [0, height / 2],
        });

        return;
      }

      if (snap === height) {
        translateY.value = withTiming(snap, undefined, finished => {
          if (finished) {
            runOnJS(dissmiss)();
          }
        });

        return;
      }

      if (snap === height / 2) {
        translateY.value = withSpring(snap);
        return;
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translate.value}],
    };
  });

  useEffect(() => {
    translateY.value = withSpring(height / 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.menu, rStyle]}>
          <Canvas style={styles.canvas}>
            <RoundedRect
              x={0}
              y={statusBarHeight}
              width={width}
              height={height}
              color={'#fff'}
              r={BORDER_RADIUS}>
              <Shadow blur={10} dx={0} dy={3} color={'#a1a1a1'} />
            </RoundedRect>
          </Canvas>

          <View style={styles.marker} />
          <View style={styles.header}>
            <Icon name={'ios-document'} size={25} color={'#000'} />
            <Text style={styles.title}>Glaceon.png</Text>
          </View>
          <ScrollView
            style={styles.content}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}>
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
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
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
  },
  marker: {
    backgroundColor: '#2C3639',
    height: 5,
    width: width * 0.25,
    borderRadius: BORDER_RADIUS,
    alignSelf: 'center',
    marginVertical: 10,
  },
  header: {
    width,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: width * 0.05,
    borderBottomColor: '#000',
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
    marginLeft: 20,
    fontSize: 15,
  },
  content: {
    paddingHorizontal: width * 0.05,
  },
  menu: {
    width,
    height,
    borderTopRightRadius: BORDER_RADIUS,
    borderTopLeftRadius: BORDER_RADIUS,
    backgroundColor: '#fff',
  },
  canvas: {
    position: 'absolute',
    top: -statusBarHeight,
    left: 0,
    width: width,
    height: height + statusBarHeight,
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
