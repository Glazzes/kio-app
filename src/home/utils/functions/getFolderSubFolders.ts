import {Notification} from '../../../enums/notification';
import {displayToast} from '../../../shared/navigation/displayToast';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {Folder, Page} from '../../../shared/types';

type Callback = (page: Page<Folder[]>) => void;

export const getFolderSubFolders = async (
  folder: Folder,
  pageNumber: number,
  callback: Callback,
) => {
  try {
    const {data} = await axiosInstance.get<Page<Folder[]>>(
      `/api/v1/folders/${folder.id}/sub-folders`,
      {params: {page: pageNumber}},
    );

    callback(data);
  } catch (e) {
    displayToast(
      'Load error',
      `Could not retrieve "${folder.name}"'s subfolders`,
      Notification.ERROR,
    );
  }
};
