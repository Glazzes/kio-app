import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {useSnapshot} from 'valtio';
import {displayToast} from '../../../shared/navigation/displayToast';
import {NotificationType} from '../../../enums/notification';
import {
  clearPictureSelection,
  pictureSelectionState,
  removeSelectedPicturesFromTaken,
} from '../../../store/photoStore';
import {uploadPictures} from '../../utils/functions/uploadPictures';
import emitter, {
  emitFolderAddFiles,
  emitFolderUpdatePreview,
} from '../../../shared/emitter';
import {PicturePickerEvent} from '../../utils/enums';
import {Navigation} from 'react-native-navigation';
import {Modals} from '../../../navigation/screens/modals';

type UploadPhotoFABProps = {
  folderId: string;
  componentId: string;
  scale?: Animated.SharedValue<number>;
};

const SIZE = 50;

const {width} = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const UploadPhotoFAB: React.FC<UploadPhotoFABProps> = ({folderId}) => {
  const selectedPictures = useSnapshot(pictureSelectionState.selectedPictures);
  const selectedPicturesUris = Object.keys(selectedPictures);
  const selectedPicturesCount = selectedPicturesUris.length;

  const openUploadDialog = () => {
    Navigation.showModal({
      component: {
        name: Modals.GENERIC_DIALOG,
        passProps: {
          title: 'Picture upload',
          message:
            'All pictures that have not been selected will be present until you close the app',
          action: upload,
        },
      },
    });
  };

  const upload = async () => {
    try {
      const {data} = await uploadPictures(folderId);

      removeSelectedPicturesFromTaken(selectedPicturesUris);
      clearPictureSelection();

      emitter.emit(PicturePickerEvent.REMOVE_PICTURES, selectedPicturesUris);

      emitFolderAddFiles(folderId, data);
      emitFolderUpdatePreview(folderId, data.length, 0);

      displayToast(
        'Pictures uploaded',
        `Upload ${selectedPicturesUris.length} pictures successfuly`,
        NotificationType.SUCCESS,
      );
    } catch (e) {
      displayToast(
        'Upload error',
        'Your pictures could have not been uploaded, try again later',
        NotificationType.ERROR,
      );
    }
  };

  return (
    <View style={styles.container}>
      {selectedPicturesCount > 0 && (
        <AnimatedPressable
          style={styles.fab}
          onPress={openUploadDialog}
          entering={ZoomIn.duration(300)}
          exiting={ZoomOut.duration(300)}>
          <Icon name="ios-cloud-upload" color={'#fff'} size={25} />
        </AnimatedPressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: width * 0.05,
    right: width * 0.05,
    width: SIZE,
    height: SIZE,
  },
  fab: {
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
