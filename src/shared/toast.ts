import {Navigation} from 'react-native-navigation';
import {NotificationType} from '../enums/notification';
import {Screens} from '../enums/screens';

type ToastMessage = {
  title: string;
  message: string;
  type: NotificationType;
};

export const displayToast = (content: ToastMessage) => {
  Navigation.showOverlay<ToastMessage>({
    component: {
      name: Screens.TOAST,
      passProps: {
        title: content.title,
        message: content.message,
        type: content.type,
      },
    },
  });
};

export const videoLoadErrorMessage: ToastMessage = {
  title: 'Load error',
  message: 'This video could not be loaded, try again later',
  type: NotificationType.ERROR,
};

export const audioLoadErrorMessage: ToastMessage = {
  title: 'Load Error',
  message: 'This audio file could not be downloaded, try again later',
  type: NotificationType.ERROR,
};

export const uploadFilesSuccessMessage = (
  uploadLength: number,
): ToastMessage => {
  const title = uploadLength > 1 ? 'Files uploaded' : 'File uploaded';
  const message =
    uploadLength > 1
      ? `${uploadLength} files have been successfully uploaded`
      : 'A file has been successfully uploaded';

  return {
    title,
    message,
    type: NotificationType.SUCCESS,
  };
};

export const uploadFilesErrorMessage: ToastMessage = {
  title: 'Upload error',
  message: 'An error ocurred while uploading your files, try again later',
  type: NotificationType.ERROR,
};

export const deleteFolderSuccessMessage = (
  name: string,
  deleteLength: number,
): ToastMessage => {
  const title = deleteLength > 1 ? 'Folders deleted' : 'Folder deleted';
  const message =
    deleteLength > 1
      ? `${deleteLength} folders were deleted successfully`
      : `Folder ${name} was deleted successfully`;

  return {
    title,
    message,
    type: NotificationType.SUCCESS,
  };
};

export const deleteFolderErrorMessage = (
  name: string,
  deleteLength: number,
): ToastMessage => {
  const message =
    deleteLength > 1
      ? 'Could not delete folders, try again later'
      : `Could not delte "${name}", try again later`;

  return {
    title: 'Folder delete error',
    message,
    type: NotificationType.ERROR,
  };
};

type CopyCut = 'copy' | 'cut';

export const copySelectionSuccessMessage = (type: CopyCut): ToastMessage => {
  const title = type === 'copy' ? 'Selection copied' : 'Selection cut';
  const message =
    type === 'copy'
      ? 'Your selection has been copied successfully copied to destination'
      : 'Your selection has been cut successfully copied to destination';

  return {
    title,
    message,
    type: NotificationType.SUCCESS,
  };
};

export const copySelectionErrorMessage = (reason?: string): ToastMessage => {
  const message =
    reason ?? 'An ocurred while copying your files, try again later';

  return {
    title: 'Copy error',
    message,
    type: NotificationType.ERROR,
  };
};

// Selection
export const deleteSelectionSuccessMessage: ToastMessage = {
  title: 'Files deleted',
  message: 'All selected files have been deleted',
  type: NotificationType.SUCCESS,
};

export const deleteSelectionErrorMessage: ToastMessage = {
  title: 'Delete error',
  message:
    'Something went wrong deleting your files, some of them may have not been deleted',
  type: NotificationType.ERROR,
};

// Sharing
export const shareInforMessage: ToastMessage = {
  title: 'Preparing file',
  message: "We're preparing your file to be shared",
  type: NotificationType.INFO,
};

export const shareErrorMessage: ToastMessage = {
  title: 'Sharing error',
  message: 'Your file could not be shared',
  type: NotificationType.ERROR,
};

export const shareNotAvialableErrorMessage: ToastMessage = {
  title: 'Sharing error',
  message: 'Your device does not have sharing capabilities',
  type: NotificationType.ERROR,
};
