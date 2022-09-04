/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useRef} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Video from 'react-native-video';
import {
  Dimensions,
  StyleSheet,
  Animated,
  PanResponder,
  ViewStyle,
  View,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {peekLast} from '../store/navigationStore';
import {Screens} from '../enums/screens';

type PictureInPictureVideoProps = {
  uri: string;
};

const {width, height} = Dimensions.get('window');
const BASE_WIDTH = 200;
const ICON_SIZE = 20;

/*
When a GestureHandlerRootView is on top of a Gesture Detector it will cause the one on top
to not longer work, so in order to drag the video around it's necesary to use animated
*/
const PictureInPictureVideo: NavigationFunctionComponent<
  PictureInPictureVideoProps
> = ({componentId}) => {
  const videoRef = useRef<Video>(null);
  const translate = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const scale = useRef(new Animated.Value(1)).current;
  const hasFinished = useRef(false);

  const goFullScreen = () => {
    console.log('Full');
    const lastFolderScreen = peekLast();
    Navigation.dismissOverlay(componentId);

    Navigation.push(lastFolderScreen.componentId, {
      component: {
        name: Screens.VIDEO_PLAYER,
      },
    });
  };

  const pop = () => {
    Animated.timing(scale, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(finished => {
      if (finished) {
        Navigation.dismissOverlay(componentId).catch(() => {});
      }
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderStart() {
      hasFinished.current = false;
    },
    onPanResponderMove(_, gesture) {
      translate.x.setValue(gesture.dx);
      translate.y.setValue(gesture.dy);
    },
    onPanResponderEnd() {
      hasFinished.current = true;
      translate.x.extractOffset();
      translate.y.extractOffset();
      translate.x.setValue(0);
    },
  });

  const viewStyle: ViewStyle = useMemo(() => {
    const derivedHeight = BASE_WIDTH * (720 / 1280);
    return {
      width: BASE_WIDTH,
      height: BASE_WIDTH * (720 / 1280),
      backgroundColor: '#f3f3f3',
      position: 'absolute',
      left: (width - BASE_WIDTH) / 2,
      top: (height - derivedHeight) / 2,
      borderRadius: 5,
      overflow: 'hidden',
      padding: 5,
    };
  }, []);

  useEffect(() => {
    translate.addListener(({x, y}) => {
      const derivedHeight = BASE_WIDTH * (720 / 1280);
      const horizontalThreshold = BASE_WIDTH / 2 + (width - BASE_WIDTH) / 2;
      const verticalThreshold = (height - derivedHeight / 2) / 2;

      if (
        (x <= -horizontalThreshold || x >= horizontalThreshold) &&
        hasFinished.current
      ) {
        pop();
        return;
      }

      if (
        (y <= -verticalThreshold || y >= verticalThreshold) &&
        hasFinished.current
      ) {
        pop();
      }
    });

    return () => {
      translate.removeAllListeners();
    };
  }, []);

  /*
  Calling gesture gestureHandlerRootHOC creates a GestureHandlerRootView that takes the
  whole screen blocking interaction to components behind
  */
  return (
    <Animated.View
      hitSlop={{top: 40, bottom: 40, left: 40, right: 40}}
      style={[
        viewStyle,
        [
          {
            transform: [
              {translateX: translate.x},
              {translateY: translate.y},
              {scale},
            ],
          },
        ],
      ]}
      {...panResponder.panHandlers}>
      <Video
        ref={videoRef}
        source={require('./assets/gru.mp4')}
        style={styles.video}
        controls={false}
        paused={false}
        resizeMode={'contain'}
        repeat={true}
        useTextureView={false}
        maxBitRate={1000000}
      />
      <View style={styles.options}>
        <Pressable
          hitSlop={20}
          style={styles.closeButton}
          onPress={goFullScreen}>
          <Icon name={'arrow-expand'} color={'#fff'} size={ICON_SIZE - 5} />
        </Pressable>
        <Pressable style={styles.closeButton} onPress={pop}>
          <Icon
            name={'plus'}
            color={'#fff'}
            size={ICON_SIZE}
            style={styles.cross}
          />
        </Pressable>
      </View>
    </Animated.View>
  );
};

PictureInPictureVideo.options = {
  overlay: {
    interceptTouchOutside: false,
  },
};

const styles = StyleSheet.create({
  video: {
    width: BASE_WIDTH,
    height: Math.ceil(BASE_WIDTH * (720 / 1280)),
    position: 'absolute',
    top: 0,
    left: 0,
  },
  options: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: ICON_SIZE * 2 + 10,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: ICON_SIZE,
    width: ICON_SIZE,
  },
  cross: {
    transform: [{rotate: '45deg'}],
  },
});

export default PictureInPictureVideo;
