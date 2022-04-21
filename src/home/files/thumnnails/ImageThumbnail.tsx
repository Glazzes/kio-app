import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import {Navigation} from 'react-native-navigation';
import {Screens} from '../../../enums/screens';

type ImageThumbnailProps = {};

const {width} = Dimensions.get('window');
const SIZE = width / 3;

const uri = 'file:///storage/sdcard0/Descargas/Callejon.png';

const toDetails = (parentId: string, fromId: string, toId: string) => {
  Navigation.push(parentId, {
    component: {
      name: Screens.IMAGE_DETAILS,
      options: {
        animations: {
          push: {
            sharedElementTransitions: [
              {
                fromId,
                toId,
                interpolation: {type: 'linear'},
                duration: 300,
              },
            ],
          },
        },
      },
    },
  });
};

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => toDetails(Screens.MY_UNIT, 'img', 'img-dest')}>
      <Image
        nativeID="img"
        source={{uri}}
        resizeMode={'cover'}
        style={styles.image}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  image: {
    width: SIZE,
    height: SIZE,
  },
});

export default ImageThumbnail;
