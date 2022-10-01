import {
  SkiaValue,
  SkPoint,
  useComputedValue,
  useTiming,
  vec,
} from '@shopify/react-native-skia';
import React, {createContext} from 'react';
import {Dimensions} from 'react-native';

type ContextProps = {
  timing: SkiaValue<number>;
  start: SkiaValue<SkPoint>;
  end: SkiaValue<SkPoint>;
};

const SkiaContext = createContext<ContextProps>();

const {width} = Dimensions.get('window');
const SIZE = (width * 0.9 - 10) / 2;

const SkiaContextProvider: React.FC = ({children}) => {
  const timing = useTiming({from: -1, to: 1, loop: true}, {duration: 1500});
  const start = useComputedValue(() => vec(timing.current * SIZE, 0), [timing]);
  const end = useComputedValue(
    () => vec(SIZE * timing.current + SIZE, 0),
    [timing],
  );

  return (
    <SkiaContext.Provider value={{timing, start, end}}>
      {children}
    </SkiaContext.Provider>
  );
};

export {SkiaContextProvider, SkiaContext};
