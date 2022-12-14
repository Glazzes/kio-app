import {View, Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type FolderSkeletonProps = {};

const {width} = Dimensions.get('window');
const SIZE = width * 0.75;
const CIRCLE_SIZE = 50;

const FolderSkeleton: React.FC<FolderSkeletonProps> = ({}) => {
  return (
    <SkeletonPlaceholder speed={2000}>
      <View style={styles.root}>
        <View style={styles.iconContainer}>
          <SkeletonPlaceholder.Item height={50} width={50} borderRadius={25} />
          <View style={{flexDirection: 'row'}}>
            <SkeletonPlaceholder.Item
              height={35}
              width={35}
              borderRadius={35 / 2}
            />
            <SkeletonPlaceholder.Item
              height={35}
              width={35}
              borderRadius={35 / 2}
            />
            <SkeletonPlaceholder.Item
              height={35}
              width={35}
              borderRadius={35 / 2}
            />
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <SkeletonPlaceholder.Item
              width={190}
              height={22}
              borderRadius={5}
            />
            <View style={styles.dots}>
              <SkeletonPlaceholder.Item height={6} width={6} borderRadius={3} />
              <SkeletonPlaceholder.Item height={6} width={6} borderRadius={3} />
              <SkeletonPlaceholder.Item height={6} width={6} borderRadius={3} />
            </View>
          </View>
          <SkeletonPlaceholder.Item width={150} height={10} borderRadius={2} />
          <SkeletonPlaceholder.Item width={180} height={10} borderRadius={2} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  root: {
    width: SIZE,
    height: 150,
    padding: 10,
    borderRadius: 10,
  },
  circle: {
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoContainer: {
    height: 55,
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dots: {
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default FolderSkeleton;
