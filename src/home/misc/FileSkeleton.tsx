import {Dimensions, StyleSheet, View, ViewStyle} from 'react-native';
import React, {useMemo} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type FileSkeletonProps = {
  index: number;
};

const {width} = Dimensions.get('window');
const SIZE = (width * 0.9 - 10) / 2;

const FileSkeleton: React.FC<FileSkeletonProps> = ({index}) => {
  const wrapperMargin: ViewStyle = useMemo(() => {
    return {marginLeft: index % 2 === 0 ? width * 0.05 : 5};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.root, wrapperMargin]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginVertical: 10,
    alignSelf: 'center',
  },
});

export default FileSkeleton;
