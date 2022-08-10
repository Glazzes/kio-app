import React, {useMemo, useRef} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Video from 'react-native-video';
import {
  Dimensions,
  StyleSheet,
  Animated,
  PanResponder,
  ViewStyle,
} from 'react-native';

type PictureInPictureVideoProps = {
  uri: string;
};

const {width, height} = Dimensions.get('window');
const BASE_WIDTH = 250;

/*
When a GestureHandlerRootView is on top of a Gesture Detector it will cause the one on top
to not longer work, so in order to drag the video around it's necesary to use animated
*/
const PictureInPictureVideo: NavigationFunctionComponent<
  PictureInPictureVideoProps
> = ({uri}) => {
  const videoRef = useRef<Video>(null);

  const translate = useRef(new Animated.ValueXY({x: 0, y: 0})).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderStart() {
      translate.x.extractOffset();
      translate.y.extractOffset();
    },
    onPanResponderMove: (_, gesture) => {
      translate.x.setValue(gesture.dx);
      translate.y.setValue(gesture.dy);
    },
  });

  const viewStyle: ViewStyle = useMemo(() => {
    const derivedHeight = BASE_WIDTH * (720 / 1280);
    return {
      width: BASE_WIDTH,
      height: BASE_WIDTH * (720 / 1280),
      backgroundColor: 'lime',
      position: 'absolute',
      left: (width - BASE_WIDTH) / 2,
      top: (height - derivedHeight) / 2,
    };
  }, []);

  /*
  Calling gesture gestureHandlerRootHOC creates a GestureHandlerRootView that takes the
  whole screen blocking interaction to components behind
  */
  return (
    <Animated.View
      style={[
        viewStyle,
        [{transform: [{translateX: translate.x}, {translateY: translate.y}]}],
      ]}
      {...panResponder.panHandlers}
    />
  );
};

PictureInPictureVideo.options = {
  overlay: {
    interceptTouchOutside: false,
  },
};

const styles = StyleSheet.create({
  video: {
    flex: 1,
  },
});

export default PictureInPictureVideo;
