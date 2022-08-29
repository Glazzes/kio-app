import {View, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {
  BlendColor,
  BlurMask,
  Canvas,
  Circle,
  Fill,
  Group,
  Image,
  Lerp,
  LinearGradient,
  Paint,
  Rect,
  RoundedRect,
  Shadow,
  useCanvasRef,
  useFont,
  useImage,
  useLoop,
  vec,
} from '@shopify/react-native-skia';

type LoginProps = {};

const {width, height} = Dimensions.get('window');
const MODAL_WIDTH = width * 0.75;

const Login: NavigationFunctionComponent<LoginProps> = ({}) => {
  const ref = useCanvasRef();
  const t = useLoop({duration: 2000});

  const image = useImage(
    'https://raw.githubusercontent.com/vijayinyoutube/colorfilterapp/master/assets/Images/product.png',
  );

  if (!image) {
    return null;
  }

  return (
    <View style={{flex: 1}}>
      <Canvas ref={ref} style={{flex: 1}}>
        <Fill color={'#fff'} />
        <RoundedRect
          x={(width * 0.25) / 2}
          y={200}
          width={MODAL_WIDTH}
          height={150}
          color={'#fff'}
          r={20}>
          <Shadow dx={13} dy={13} blur={13} color={'#e3e3e3'} />
        </RoundedRect>
      </Canvas>
    </View>
  );
};

Login.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  canvas: {
    width,
    height,
    position: 'absolute',
  },
});

export default Login;
