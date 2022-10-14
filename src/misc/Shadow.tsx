import {ViewStyle} from 'react-native';
import React, {useMemo} from 'react';
import {
  Canvas,
  RoundedRect,
  Shadow as SkiaShadow,
} from '@shopify/react-native-skia';

type ShadowProps = {
  height: number;
  width: number;
};

const Shadow: React.FC<ShadowProps> = ({height, width}) => {
  const styles: ViewStyle = useMemo(
    () => ({
      height: height + 60,
      width: width + 60,
      position: 'absolute',
      top: 0,
      transform: [{translateY: -10}, {translateX: -10}],
      backgroundColor: '#fff',
    }),
    [width, height],
  );

  return (
    <Canvas style={styles}>
      <RoundedRect
        x={10}
        y={10}
        width={width}
        height={height}
        r={10}
        color={'#fff'}>
        <SkiaShadow blur={10} dx={10} dy={12} color={'rgba(0, 0, 0, 0.2)'} />
      </RoundedRect>
    </Canvas>
  );
};

export default Shadow;
