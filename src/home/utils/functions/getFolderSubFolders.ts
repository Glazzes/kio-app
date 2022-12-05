import {NotificationType} from '../../../enums/notification';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {displayToast} from '../../../shared/toast';
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
    displayToast({
      title: 'Load error',
      message: `Could not retrieve "${folder.name}"'s subfolders`,
      type: NotificationType.ERROR,
    });
  }
};
