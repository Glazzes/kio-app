import {View, Text, StyleSheet, Dimensions, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  BackdropBlur,
  BlendColor,
  Canvas,
  Circle,
  ColorMatrix,
  Easing,
  Fill,
  Image,
  Lerp,
  LinearGradient,
  Offset,
  Paint,
  Path,
  Rect,
  runTiming,
  Skia,
  SkPath,
  useImage,
  useTouchHandler,
  useValue,
  vec,
} from '@shopify/react-native-skia';

type LoginProps = {};

const {width, height} = Dimensions.get('window');

const path = Skia.Path.Make();

const Login: React.FC<LoginProps> = ({}) => {
  const [paths, setPaths] = useState<SkPath[]>([]);

  const touch = useTouchHandler({
    onStart: e => {
      path.moveTo(e.x, e.y);
    },
    onActive: e => {
      path.lineTo(e.x, e.y);
    },
    onEnd: e => {
      paths.push(path);
    },
  });

  return (
    <View style={styles.root}>
      <Canvas style={{width, height}} onTouch={touch}>
        <Fill color={'#000'} />
        {paths.map((p, index) => {
          return (
            <Offset x={10} y={10}>
              <Path
                key={`path-${index}`}
                path={p}
                style={'stroke'}
                strokeCap={'round'}
                strokeWidth={3}
                color={'orange'}
                antiAlias={true}
              />
            </Offset>
          );
        })}

        <Path
          path={path}
          style={'stroke'}
          strokeCap={'round'}
          strokeWidth={3}
          color={'orange'}
        />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
