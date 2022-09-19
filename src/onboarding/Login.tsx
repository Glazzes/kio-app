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
  Image,
  Group,
} from '@shopify/react-native-skia';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {GestureDetector} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const pascal = [1, 6, 15, 20, 15, 6, 1];
let ratio = 0;
for (let i = 0; i < pascal.length; i++) {
  for (let j = 0; j < pascal.length; j++) {
    ratio += pascal[i] * pascal[j];
  }
}

const shader = `
  uniform shader image;
  uniform float[7] pascal;
  uniform float ratio;

  vec4 blur7Samples(vec2 xy) {
    vec3 color = vec3(0.0);

    for(int x = -3; x <= 3; x++) {
      for(int y = -3; y <= 3; y++) {
        float weight = pascal[x + 3] * pascal[y + 3];
        color += image.eval(vec2(xy.x + float(x), xy.y + float(y))).rgb * weight;
      }
    }

    color /= ratio;
    return vec4(color, 1.0);
  }

  vec4 blur5Samples(vec2 xy) {
    vec3 color = vec3(0.0);

    for(int x = -2; x <= 2; x++) {
      for(int y = -2; y <= 2; y++) {
        color += image.eval(vec2(xy.x + float(x), xy.y + float(y))).rgb;
      }
    }

    color /= 25;
    return vec4(color, 1.0);
  }

  vec4 blur3Samples(vec2 xy) {
    vec3 color = vec3(0.0);

    for(int x = -1; x <= 1; x++) {
      for(int y = -1; y <= 1; y++) {
        color += image.eval(vec2(xy.x + float(x), xy.y + float(y))).rgb;
      }
    }

    color /= 9;
    return vec4(color, 1.0);
  }

  vec4 main(vec2 xy) {
    float aspectRatio =  ${height} / ${width};
    vec2 pos = xy / vec2(${width}, ${height});
    float dst = distance(vec2(pos.x, pos.y * aspectRatio), vec2(0.5, 0.5 * aspectRatio));

    if(dst < 0.25) {
      vec4 pixel = image.eval(xy).rgba;
      // pixel.b = 1.0;
      return pixel;
    }

    if(dst < 0.3 && dst > 0.27) {
      return blur5Samples(xy);
    }

    if(dst < 0.27 && dst > 0.25) {
      return blur3Samples(xy);
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
    return [{translateX: 100 * progress.current}];
  }, [progress]);

  const image = useImage(
    'https://cdn.shopify.com/s/files/1/0516/0609/3998/products/smart-phone-wallpaper-digital-download-sunset-bright-733022.jpg?v=1652904193',
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
          <Shader source={source} uniforms={{pascal, ratio}}>
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

        <Group
          transform={[{rotate: Math.PI / 4}, {scale: 2}]}
          origin={{x: width / 2, y: height / 2}}>
          <Image
            image={melon}
            x={width / 2 - 50}
            y={height / 2 - 50}
            width={100}
            height={100}
            fit={'cover'}
          />
        </Group>
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
