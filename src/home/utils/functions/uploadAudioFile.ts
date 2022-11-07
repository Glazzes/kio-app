import {DocumentPickerResponse} from 'react-native-document-picker';
import Sound from 'react-native-sound';
import {Notification} from '../../../enums/notification';
import {apiFilesUrl} from '../../../shared/constants';
import {displayToast} from '../../../shared/navigation/displayToast';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {File, UploadRequest} from '../../../shared/types';
import emitter from '../../../utils/emitter';
import {UpdateFolderEvent} from '../types';

export const uploadAudioFile = (
  to: string,
  componentId: string,
  pick: DocumentPickerResponse,
) => {
  const type = pick.type ?? 'audio/mpeg';
  const mimeType = type.slice(type.lastIndexOf('/') + 1, type.length);
  const extension = mimeType === 'mpeg' ? 'mp3' : mimeType;
  const name = `${pick.name}.${extension}`;

  const formData = new FormData();
  const request: UploadRequest = {
    to,
    details: {
      [name]: {
        dimensions: null,
        duration: null,
        thumbnailName: null,
      },
    },
  };

  formData.append('files', {
    name,
    type,
    uri: pick.fileCopyUri!!,
  });

  const sound = new Sound(pick.fileCopyUri, undefined, async error => {
    if (error) {
      console.log('upload', error);
    }

    request.details[name].duration = sound.getDuration();
    formData.append('request', JSON.stringify(request));

    try {
      const {data} = await axiosInstance.post<File[]>(apiFilesUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      emitter.emit(`${UpdateFolderEvent.ADD_FILES}-${componentId}`, data);
    } catch (e) {
      displayToast(
        'Upload error',
        `An error happended while uploading ${pick.name}`,
        Notification.ERROR,
      );
    } finally {
      sound.release();
    }
  });
};
