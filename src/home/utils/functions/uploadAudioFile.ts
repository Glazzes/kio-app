import {DocumentPickerResponse} from 'react-native-document-picker';
import Sound from 'react-native-sound';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {
  displayToast,
  insufficientStorageMessage,
  uploadFilesErrorMessage,
} from '../../../shared/toast';
import {File, UploadRequest} from '../../../shared/types';
import {emitFolderAddFiles} from '../../../shared/emitter';
import {apiFilesUrl} from '../../../shared/requests/contants';

export const uploadAudioFile = (
  folderId: string,
  pick: DocumentPickerResponse,
) => {
  const type = pick.type ?? 'audio/mpeg';
  const mimeType = type.slice(type.lastIndexOf('/') + 1, type.length);
  const extension = mimeType === 'mpeg' ? 'mp3' : mimeType;
  const name = pick.name.includes('.')
    ? pick.name
    : `${pick.name}.${extension}`;

  const formData = new FormData();
  const request: UploadRequest = {
    to: folderId,
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

      emitFolderAddFiles(folderId, data);
    } catch (e) {
      // @ts-ignore
      const response = e.response as AxiosResponse;
      if (response.status === 409) {
        displayToast(insufficientStorageMessage);
        return;
      }

      displayToast(uploadFilesErrorMessage);
    } finally {
      sound.release();
    }
  });
};
