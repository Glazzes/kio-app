import {Dimensions, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {Navigation} from 'react-native-navigation';
import {Modals} from '../../navigation/screens/modals';

type UploadPhotoFABProps = {
  componentId: string;
  selectedPhotos: string[];
  scale?: Animated.SharedValue<number>;
};

const SIZE = 50;

const {width} = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const UploadPhotoFAB: React.FC<UploadPhotoFABProps> = ({
  componentId,
  selectedPhotos,
}) => {
  const upload = async () => {
    Navigation.showModal({
      component: {
        name: Modals.GENERIC_DIALOG,
        passProps: {
          title: 'Upload photos',
          message:
            'All photos that have been not selected will be lost, this action can not be undone',
        },
      },
    });
  };

  return (
    <AnimatedPressable
      style={styles.fab}
      onPress={upload}
      entering={ZoomIn.duration(300)}
      exiting={ZoomOut.duration(300)}>
      <Icon name="ios-cloud-upload" color={'#fff'} size={25} />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: width * 0.05,
    right: width * 0.05,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: '#3366ff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default UploadPhotoFAB;
