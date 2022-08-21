import {View} from 'react-native';
import React from 'react';
import {File} from '../../../utils/types';
import ImageThumbnail from './ImageThumbnail';
import {useSharedValue} from 'react-native-reanimated';

type ThumnailWrapperProps = {
  file: File;
  index: number;
};

type WrapperProps = {
  children: React.ReactNode;
};

const Wrapper: React.FC<WrapperProps> = ({children}) => {
  return <View>{children}</View>;
};

const ThumnailWrapper: React.FC<ThumnailWrapperProps> = ({file, index}) => {
  const opacity = useSharedValue<number>(1);

  if (file.contentType.startsWith('image')) {
    return (
      <Wrapper>
        <ImageThumbnail image={file} index={index} opacity={opacity} />;
      </Wrapper>
    );
  }

  return null;
};

export default ThumnailWrapper;
