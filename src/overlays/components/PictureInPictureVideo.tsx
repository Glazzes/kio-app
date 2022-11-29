/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useRef, useState} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {peekLastNavigationScreen} from '../../store/navigationStore';
import {Screens} from '../../enums/screens';
import {File} from '../../shared/types';
import {staticFileUrl} from '../../shared/requests/contants';
import {useSnapshot} from 'valtio';
import authState from '../../store/authStore';
import {displayToast, videoLoadErrorMessage} from '../../shared/toast';

type PictureInPictureVideoProps = {
  file: File;
};

const {width, height} = Dimensions.get('window');
const SIZE = 250;
const ICON_SIZE = 20;

/*
When a GestureHandlerRootView is on top of a Gesture Detector it will cause the one on top
to not longer work, so in order to drag the video around it's necesary to use animated from RN
*/
const PictureInPictureVideo: NavigationFunctionComponent<
  PictureInPictureVideoProps
> = ({componentId, file}) => {
  const uri = staticFileUrl(file.id);
  const {accessToken} = useSnapshot(authState.tokens);

  const [ready, setReady] = useState<boolean>(false);

  const videoRef = useRef<Video>(null);
  const translate = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const scale = useRef(new Animated.Value(1)).current;
  const hasFinished = useRef(false);

  const goFullScreen = () => {
    const lastFolderScreen = peekLastNavigationScreen();
    Navigation.dismissOverlay(componentId);

    Navigation.push(lastFolderScreen.componentId, {
      component: {
        name: Screens.VIDEO_PLAYER,
        passProps: {
          file,
        },
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

  const onError = () => {
    pop();
    displayToast(videoLoadErrorMessage);
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
    const videoWidth = file.details.dimensions?.[0] ?? SIZE;
    const videoHeight = file.details.dimensions?.[1] ?? SIZE;

    const aspectRatio = videoWidth / videoHeight;
    const isWider = videoWidth > videoHeight;

    const finalWidth = isWider ? SIZE : SIZE * aspectRatio;
    const finalHeight = isWider ? SIZE / aspectRatio : SIZE;

    return {
      width: finalWidth,
      height: finalHeight,
      backgroundColor: '#000',
      position: 'absolute',
      overflow: 'hidden',
      left: (width - finalWidth) / 2,
      top: (height - finalHeight) / 2,
      borderRadius: 5,
    };
  }, []);

  useEffect(() => {
    translate.addListener(({x, y}) => {
      const videoWidth = file.details.dimensions?.[0] ?? SIZE;
      const videoHeight = file.details.dimensions?.[1] ?? SIZE;

      const aspectRatio = videoWidth / videoHeight;
      const isWider = videoWidth > videoHeight;

      const finalWidth = isWider ? SIZE : SIZE * aspectRatio;
      const finalHeight = isWider ? SIZE / aspectRatio : SIZE;

      const horizontalThreshold = finalWidth / 2 + (width - finalWidth) / 2;
      const verticalThreshold = (height - finalHeight / 2) / 2;

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
        source={{uri, headers: {Authorization: `Bearer ${accessToken}`}}}
        style={{
          width: viewStyle.width,
          height: viewStyle.height,
          margin: 0,
          padding: 0,
        }}
        controls={false}
        paused={false}
        resizeMode={'contain'}
        repeat={true}
        useTextureView={false}
        onReadyForDisplay={() => setReady(true)}
        onError={onError}
      />
      {!ready && (
        <View style={styles.placeholder}>
          <ActivityIndicator size={'large'} color={'#3366ff'} />
        </View>
      )}
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
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  options: {
    position: 'absolute',
    top: 10,
    right: 10,
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
