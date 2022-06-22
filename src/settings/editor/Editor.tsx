import {View, Dimensions, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import SVG, {Path} from 'react-native-svg';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {useVector} from 'react-native-redash';
import {clamp, pinch, set} from '../../utils/animations';
import {HStack, IconButton, NativeBaseProvider} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlipType, manipulateAsync, SaveFormat} from 'expo-image-manipulator';
import {Asset} from 'expo-media-library';
import EffectIndicator from './EffectIndicator';
import crop from '../utils/crop';
import imageStyles from '../utils/imageStyles';
import {maxScale} from './utils';

type EditorProps = {
  asset: Asset;
};

const {width, height} = Dimensions.get('window');
const R = (width / 2) * 0.8;
const center = {x: width / 2, y: height * 0.4};
const path = [
  'M 0 0',
  `h ${width}`,
  `v ${height}`,
  `h ${-width}`,
  `v ${-height}`,
  `M ${center.x - R} ${center.y}`,
  `a 1 1 0 0 0 ${R * 2} 0`,
  `a 1 1 0 0 0 ${-R * 2} 0`,
];

const CROP_SIZE = 180;

const Editor: NavigationFunctionComponent<EditorProps> = ({
  componentId,
  asset,
}) => {
  const dimensions = useMemo(
    () => ({width: asset.width, height: asset.height}),
    [asset],
  );

  const imageStyle = useMemo(
    () => imageStyles({width: asset.width, height: asset.height}, R),
    [asset],
  );

  const layout = useVector(0, 0);
  const original = useVector(0, 0);

  const rotateImage = useSharedValue<number>(0);
  const rotate = useVector(0, 0);

  const translate = useVector(0, 0);
  const offset = useVector(0, 0);

  const scale = useSharedValue<number>(1);
  const scaleOffset = useSharedValue<number>(1);

  const origin = useVector(0, 0);
  const originAssign = useSharedValue<boolean>(true);

  const translation = useDerivedValue<{x: number; y: number}>(() => {
    let offsetX = (layout.x.value * scale.value - R * 2) / 2;
    let offsetY = (layout.y.value * scale.value - R * 2) / 2;

    const x = clamp(translate.x.value, -offsetX, offsetX);
    const y = clamp(translate.y.value, -offsetY, offsetY);

    return {x, y};
  }, [translate.x.value, translate.y.value, scale.value]);

  const pan = Gesture.Pan()
    .maxPointers(1)
    .onStart(_ => {
      offset.x.value = translation.value.x;
      offset.y.value = translation.value.y;
    })
    .onChange(e => {
      translate.x.value = offset.x.value + e.translationX;
      translate.y.value = offset.y.value + e.translationY;
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(_ => {
      offset.x.value = translation.value.x;
      offset.y.value = translation.value.y;
      scaleOffset.value = scale.value;
    })
    .onChange(e => {
      const {translateX, translateY} = pinch(
        {x: layout.x.value / 2, y: layout.y.value / 2},
        {x: offset.x.value, y: offset.y.value},
        e,
        origin,
        originAssign,
      );

      translate.x.value = offset.x.value + translateX;
      translate.y.value = offset.y.value + translateY;
      scale.value = clamp(
        e.scale * scaleOffset.value,
        1,
        maxScale(layout, dimensions, rotateImage.value),
      );
    })
    .onEnd(_ => {
      originAssign.value = true;
    });

  const gesture = Gesture.Exclusive(pan, pinchGesture);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translation.value.x},
        {translateY: translation.value.y},
        {scale: scale.value},
      ],
    };
  });

  const reflectionStyles = useAnimatedStyle(() => {
    return {
      height: layout.y.value,
      width: layout.x.value,
    };
  });

  const effectStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {rotate: `${rotateImage.value}rad`},
        {rotateY: `${rotate.y.value}rad`},
        {rotateX: `${rotate.x.value}rad`},
      ],
    };
  });

  const cropImage = async () => {
    const actions = [];

    /*
      Rotation must always happend after flip, otherwise the cropped image
      will differ by a lot to the one shown in the svg circle
    */
    if (rotate.y.value === Math.PI) {
      actions.push({flip: FlipType.Horizontal});
    }

    if (rotate.x.value === Math.PI) {
      actions.push({flip: FlipType.Vertical});
    }

    if (rotateImage.value !== 0) {
      actions.push({
        rotate: rotateImage.value * (180 / Math.PI),
      });
    }

    const {x, y, size, resize} = crop(
      {width: layout.x.value, height: layout.y.value},
      {width: dimensions.width, height: dimensions.height},
      {x: translate.x.value, y: translate.y.value},
      scale.value,
      rotateImage.value,
      R,
      CROP_SIZE,
    );

    const {uri} = await manipulateAsync(
      asset.uri,
      [
        resize !== null ? {resize} : {rotate: 0},
        ...actions,
        {
          crop: {
            originX: x,
            originY: y,
            height: size,
            width: size,
          },
        },
      ],
      {base64: false, compress: 1, format: SaveFormat.PNG},
    );

    Navigation.push(componentId, {
      component: {
        name: 'Result',
        passProps: {
          uri,
        },
      },
    });
  };

  useAnimatedReaction(
    () => rotateImage.value,
    value => {
      scale.value = 1;
      set(translate, 0);
      set(offset, 0);
      layout.x.value =
        value === Math.PI || value === 0 ? original.x.value : original.y.value;
      layout.y.value =
        value === Math.PI || value === 0 ? original.y.value : original.x.value;
    },
  );

  return (
    <NativeBaseProvider>
      <View style={styles.root}>
        <Animated.View style={[styles.container, rStyle]}>
          <Animated.Image
            nativeID={`${asset.uri}-dest`}
            onLayout={e => {
              layout.x.value = e.nativeEvent.layout.width;
              layout.y.value = e.nativeEvent.layout.height;
              original.x.value = e.nativeEvent.layout.width;
              original.y.value = e.nativeEvent.layout.height;
            }}
            resizeMethod={'scale'}
            resizeMode={'cover'}
            source={{uri: asset.uri}}
            style={[imageStyle, effectStyles]}
          />
        </Animated.View>
        <SVG
          width={width}
          height={height}
          style={StyleSheet.absoluteFillObject}>
          <Path d={path.join(' ')} fill={'rgba(0, 0, 0, 0.45)'} />
        </SVG>
        <View style={styles.reflection}>
          <GestureDetector gesture={gesture}>
            <Animated.View>
              <Animated.View style={[reflectionStyles, rStyle]} />
            </Animated.View>
          </GestureDetector>
        </View>
        <HStack
          alignSelf={'flex-end'}
          position={'absolute'}
          w={'60%'}
          alignItems={'center'}
          bottom={5}
          justifyContent={'space-evenly'}>
          <EffectIndicator
            effect={rotateImage}
            icon={'format-rotate-90'}
            action={'rotate'}
          />

          <EffectIndicator
            effect={rotate.x}
            icon={'flip-vertical'}
            action={'flip'}
          />

          <EffectIndicator
            effect={rotate.y}
            icon={'flip-horizontal'}
            action={'flip'}
          />

          <IconButton
            onPress={cropImage}
            icon={<MaterialCommunityIcons name="check" size={30} />}
            bgColor={'#3366ff'}
            borderRadius={'full'}
            _icon={{
              color: '#fff',
              size: 'md',
            }}
          />
        </HStack>
      </View>
    </NativeBaseProvider>
  );
};

Editor.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
  bottomTabs: {
    visible: false,
    animate: true,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    width,
    height: height * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reflection: {
    position: 'absolute',
    width,
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Editor;
