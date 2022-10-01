import {
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  View,
  SectionList,
  SectionListRenderItemInfo,
  SectionListData,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  Navigation,
  NavigationFunctionComponent,
  OptionsModalPresentationStyle,
} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withTiming,
  withDecay,
  withSpring,
  useAnimatedReaction,
  scrollTo,
  useAnimatedRef,
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

type Action = {
  icon: string;
  text: string;
};

const sections: {title: string; data: Action[]}[] = [
  {
    title: 'General',
    data: [
      {icon: 'ios-arrow-forward', text: 'Open'},
      {icon: 'ios-information-circle', text: 'Details'},
      {icon: 'ios-cloud-download', text: 'Download'},
    ],
  },
  {
    title: 'Modify',
    data: [
      {icon: 'ios-heart', text: 'Favorite'},
      {icon: 'ios-create', text: 'Rename'},
    ],
  },
  {
    title: 'Copy',
    data: [
      {icon: 'ios-copy', text: 'Copy '},
      {icon: 'ios-cut', text: 'Cut'},
    ],
  },
  {
    title: 'Social',
    data: [
      {icon: 'ios-link-outline', text: 'Copy link'},
      {icon: 'ios-share-social', text: 'Share'},
    ],
  },
  {
    title: 'Danger zone',
    data: [{icon: 'ios-trash', text: 'Delete'}],
  },
];

const {width, height} = Dimensions.get('window');
const BORDER_RADIUS = 10;

// const AnimatedPresable = Animated.createAnimatedComponent(Pressable);
const {statusBarHeight} = Navigation.constantsSync();

function renderItem(info: SectionListRenderItemInfo<Action>) {
  const color = {
    color: info.item.text === 'Delete' ? '#ee3060' : '#000',
  };

  return (
    <View style={styles.actionContainer}>
      <Icon
        name={info.item.icon}
        color={info.item.text === 'Delete' ? '#ee3060' : '#aaa'}
        size={22}
        style={styles.icon}
      />
      <Text style={[styles.actionText, color]}>{info.item.text}</Text>
    </View>
  );
}

function renderSectionHeader(info: SectionListData<Action>) {
  return <Text style={styles.sectionTitle}>{info.section.title}</Text>;
}

function sectionSeparator() {
  return <View style={{height: 15}} />;
}

const FileMenu: NavigationFunctionComponent<FileMenuProps> = ({
  componentId,
}) => {
  const aRef = useAnimatedRef<SectionList>();

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

  const backgroundColor = useSharedValue<string>('transparent');
  const translateY = useSharedValue<number>(height);
  const offset = useSharedValue<number>(0);

  const translate = useDerivedValue<number>(() => {
    return clamp(translateY.value, 0, height);
  }, [translateY]);

  const scroll = useDerivedValue<number>(() => {
    return clamp(translateY.value, -225, height / 2);
  }, [translateY]);

  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.value = scroll.value;
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
          clamp: [-225, height / 2],
        });

        return;
      }

      if (snap === height) {
        backgroundColor.value = withTiming('transparent', {duration: 150});
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

  const rootStyles = useAnimatedStyle(() => {
    return {backgroundColor: backgroundColor.value};
  });

  useAnimatedReaction(
    () => scroll.value,
    y => {
      scrollTo(aRef, 0, -1 * y, false);
    },
  );

  useEffect(() => {
    backgroundColor.value = withTiming('rgba(0, 0, 0, 0.3)');
    translateY.value = withSpring(height / 2);

    const backLisnter =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          if (buttonId === 'RNN.hardwareBackButton') {
            backgroundColor.value = withTiming('transparent', {duration: 150});
            translateY.value = withTiming(height, undefined, finished => {
              if (finished) {
                runOnJS(dissmiss)();
              }
            });
          }
        },
      );

    return () => {
      backLisnter.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.root, rootStyles]}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.menu, rStyle]}>
          <View style={styles.marker} />
          <View style={styles.header}>
            <Icon name={'ios-document'} color={'#000'} size={22} />
            <Text style={styles.title}>Glaceon.png</Text>
          </View>
          <SectionList
            ref={aRef}
            sections={sections}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            SectionSeparatorComponent={sectionSeparator}
            style={styles.content}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
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
  hardwareBackButton: {
    dismissModalOnPress: false,
  },
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
    // borderBottomWidth: 1,
    paddingVertical: 10,
    paddingBottom: 20,
    paddingHorizontal: width * 0.05,
    borderBottomColor: '#000',
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
    marginLeft: 20,
    fontSize: 15,
  },
  sectionTitle: {
    fontFamily: 'UberBold',
    color: '#aaa',
    fontSize: 14,
  },
  content: {
    paddingHorizontal: width * 0.05,
  },
  menu: {
    width,
    height,
    borderTopRightRadius: BORDER_RADIUS,
    borderTopLeftRadius: BORDER_RADIUS,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
    marginVertical: 7.5,
    height: 30,
    marginLeft: 20,
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
