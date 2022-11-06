import {Notification} from '../../../enums/notification';
import {displayToast} from '../../../shared/navigation/displayToast';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {Folder} from '../../../shared/types';
import {pushNavigationScreen} from '../../../store/navigationStore';

type Callback = (folder: Folder) => void;

export const getFolder = async (
  componentId: string,
  folder: Folder | undefined,
  callback: Callback,
) => {
  try {
    const {data: unit}: {data: Folder} = await axiosInstance.get(
      '/api/v1/folders/my-unit',
    );

    callback(unit);

    console.log(unit.id);
    pushNavigationScreen({name: unit.name, folderId: unit.id, componentId});
  } catch (e) {
    const errorMessage = folder
      ? `Could not retrieve information about ${folder.name} folder`
      : 'Could not retrieve information about this folder';

    displayToast('Load error', errorMessage, Notification.ERROR);
  }
};
