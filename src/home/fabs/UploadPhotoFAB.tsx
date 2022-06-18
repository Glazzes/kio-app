import {StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';

type UploadPhotoFABProps = {
  photos?: string[];
};

const SIZE = 50;
const PADDING = 10;

const UploadPhotoFAB: React.FC<UploadPhotoFABProps> = ({}) => {
  return (
    <Animated.View
      style={styles.fab}
      entering={ZoomIn.duration(300)}
      exiting={ZoomOut.duration(300)}>
      <Icon name="cloud-upload" color={'#fff'} size={25} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: PADDING,
    right: PADDING,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: '#3366ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UploadPhotoFAB;
