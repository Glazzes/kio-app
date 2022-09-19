import {View, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {
  Canvas,
  Fill,
  Shader,
  ImageShader,
  Skia,
  useImage,
  useValue,
  useComputedValue,
  runTiming,
} from '@shopify/react-native-skia';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {GestureDetector} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const pascal = [1, 6, 15, 20, 15, 6, 1];
let ratio = pascal.reduce((p, n) => p + n);

const shader = `
  uniform shader image;
  uniform float[7] pascal;
  uniform float ratio;
  uniform float x;

  vec4 blur7Samples(vec2 xy) {
    vec3 color = vec3(0.0);

    for(int i = -3; i <= 3; i++) {
      color += image.eval(vec2(xy.x + float(i), xy.y)).rgb * pascal[i + 3];
      color += image.eval(vec2(xy.x, xy.y + float(i))).rgb * pascal[i + 3];
    }

    color /= ratio * 2;
    return vec4(color, 1.0);
  }

  vec4 main(vec2 xy) {
    float aspectRatio =  ${height} / ${width};
    vec2 pos = xy / vec2(${width}, ${height});
    float dst = distance(vec2(pos.x, pos.y * aspectRatio), vec2(0.5, x * aspectRatio));

    if(dst < 0.25) {
      vec4 pixel = image.eval(xy).rgba;
      // pixel.b = 1.0;
      return pixel;
    }

    // return image.eval(xy).rgba;
    return blur7Samples(xy);
  }
`;

const source = Skia.RuntimeEffect.Make(shader)!;

if (!source) {
  throw new Error('Shader could not compile');
}

const Example: NavigationFunctionComponent = () => {
  const progress = useValue(0);
  runTiming(
    progress,
    {from: 0, to: 1, loop: true, yoyo: false},
    {duration: 3000},
  );

  const uniform = useComputedValue(() => {
    return {x: progress.current, pascal, ratio};
  }, [progress]);

  const image = useImage(
    'https://i.pinimg.com/originals/43/82/66/438266e9aa4487c7d06e5aeb6318e32f.jpg',
  );

  const cat = useImage(require('./melo_cat.png'));
  const melon = useImage(require('./melon.png'));

  if (image === null || cat === null || melon === null) {
    return null;
  }

  return (
    <View style={{width, height}}>
      <Canvas style={{width, height}} pointerEvents={'none'}>
        <Fill color={'#000'} />

        <Fill>
          <Shader source={source} uniforms={uniform}>
            <ImageShader
              image={image}
              x={0}
              y={0}
              width={width}
              height={height}
              fit={'cover'}
            />
          </Shader>
        </Fill>
      </Canvas>
      <GestureDetector>
        <Animated.View style={styles.sticker}>
          <View />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

Example.options = {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  sticker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderStyle: 'dashed',
    borderColor: '#fff',
    borderWidth: 2,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default Example;
