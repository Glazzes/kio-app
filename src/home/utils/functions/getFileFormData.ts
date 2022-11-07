import {getThumbnailAsync} from 'expo-video-thumbnails';
import {Image} from 'react-native';
import {DocumentPickerResponse} from 'react-native-document-picker';
import PdfThumbnail from 'react-native-pdf-thumbnail';
import Sound from 'react-native-sound';
import {UploadRequest} from '../../../shared/types';

export const getFileFormData = async (
  to: string,
  files: DocumentPickerResponse[],
) => {
  const formData = new FormData();
  const request: UploadRequest = {
    to,
    details: {},
  };

  for (let file of files) {
    formData.append('files', {
      name: file.name,
      type: file.type,
      uri: file.uri,
    });

    request.details[file.name] = {
      thumbnailName: null,
      dimensions: null,
      duration: null,
    };

    if (file.type?.startsWith('video') || file.type?.startsWith('audio')) {
      const sound = new Sound(file.fileCopyUri!!, undefined, e => {
        if (e) {
          console.log(e);
        }

        request.details[file.name].duration = Math.floor(sound.getDuration());
        sound.release();
      });
    }

    if (file.type?.startsWith('image')) {
      await Image.getSize(file.uri, (w, h) => {
        request.details[file.name].dimensions = [w, h];
      });
    }

    if (file.type?.endsWith('pdf')) {
      const {uri, width, height} = await PdfThumbnail.generate(file.uri, 0);

      formData.append('thumbnails', {
        uri,
        name: file.name,
        type: 'image/jpeg',
      });

      request.details[file.name].dimensions = [width, height];
    }

    if (file.type?.startsWith('video')) {
      const {uri, width, height} = await getThumbnailAsync(file.uri, {
        time: 5000,
        quality: 1,
      });

      formData.append('thumbnails', {
        uri,
        name: file.name,
        type: 'image/jpeg',
      });

      request.details[file.name].dimensions = [width, height];
    }
  }

  formData.append('request', JSON.stringify(request));

  return formData;
};
