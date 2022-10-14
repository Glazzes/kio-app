import {Dimensions} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const {width} = Dimensions.get('window');
const SIZE = (width * 0.9 - 10) / 2;

const FileSkeleton: React.FC = () => {
  return (
    <SkeletonPlaceholder speed={2000}>
      <SkeletonPlaceholder.Item width={SIZE} height={SIZE} borderRadius={5} />

      <SkeletonPlaceholder.Item
        marginTop={10}
        width={100}
        height={13}
        borderRadius={5}
      />
      <SkeletonPlaceholder.Item
        marginTop={5}
        width={50}
        height={13}
        borderRadius={5}
      />
    </SkeletonPlaceholder>
  );
};

export default FileSkeleton;
