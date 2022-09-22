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

const pascal = [
  1, 30, 435, 4060, 27405, 142506, 593775, 2035800, 5852925, 14307150, 30045015,
  54627300, 86493225, 119759850, 145422675, 155117520, 145422675, 119759850,
  86493225, 54627300, 30045015, 14307150, 5852925, 2035800, 593775, 142506,
  27405, 4060, 435, 30, 1,
];
let ratio = 0; // pascal.reduce((p, n) => p + n);

for (let x = 0; x < pascal.length; x++) {
  for (let y = 0; y < pascal.length; y++) {
    ratio += pascal[x] * pascal[y];
  }
}

const shader = `
  uniform shader image;
  uniform float[31] pascal;
  uniform float ratio;
  uniform float x;

  vec4 blur(vec2 xy) {
    vec3 color = vec3(0.0);

    
    for(int x = -15; x <= 15; x++) {
      for(int y = -15; y <= 15; y++) {
        color += image.eval(vec2(xy.x + float(x), xy.y + float(y))).rgb * pascal[x + 15] * pascal[y + 15];
      }
    }

    /* 
    for(int i = -15; i < 15; i++) {
      color += image.eval(vec2(xy.x + float(i), xy.y)).rgb * pascal[i + 15];
      color += image.eval(vec2(xy.x, xy.y + float(i))).rgb * pascal[i + 15];
    }
    */
    

    color /= ratio;
    return vec4(color, 1.0);
  }

  vec4 main(vec2 xy) {
    float aspectRatio =  ${height} / ${width};
    vec2 pos = xy / vec2(${width}, ${height});
    float dst = distance(vec2(pos.x, pos.y * aspectRatio), vec2(0.5, x * aspectRatio));
    
    /*
    if(dst < 0.3) {
      return image.eval(xy).rgba;
    }
    */

    
    return blur(xy);
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
    'https://petpress.net/wp-content/uploads/2019/10/husky_ragdoll_70706343_660953497727250_1165151890636781816_n.jpg',
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
