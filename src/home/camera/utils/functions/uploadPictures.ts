import {axiosInstance} from '../../../../shared/requests/axiosInstance';
import {apiFilesUrl} from '../../../../shared/requests/contants';
import {File, UploadRequest} from '../../../../shared/types';
import {pictureSelectionState} from '../../../../store/photoStore';

export const uploadPictures = async (to: string) => {
  const selectedPictures = pictureSelectionState.selectedPictures;
  const selectedPicturesUris = Object.keys(selectedPictures);

  const uploadRequest: UploadRequest = {
    to,
    details: {},
  };

  const formData = new FormData();
  for (let uri of selectedPicturesUris) {
    console.log(selectedPictures[uri], uri, to);
    const name = selectedPictures[uri].name;
    formData.append('files', {
      uri,
      name,
      type: 'image/jpeg',
    });

    uploadRequest.details[name] = {
      duration: null,
      thumbnailName: null,
      dimensions: [selectedPictures[uri].width, selectedPictures[uri].height],
    };
  }

  formData.append('request', JSON.stringify(uploadRequest));

  return axiosInstance.post<File[]>(apiFilesUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
