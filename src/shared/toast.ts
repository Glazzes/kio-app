import {Navigation} from 'react-native-navigation';
import {NotificationType} from '../enums/notification';
import {Screens} from '../enums/screens';

type ToastMessage = {
  title: string;
  message: string;
  type: NotificationType;
};

type CopyCut = 'copy' | 'cut';

type FileType = 'file' | 'folder';

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

export const updateResourceSuccessMessage = (
  prevName: string,
  newName: string,
  type: FileType,
): ToastMessage => {
  const message =
    prevName === newName
      ? `${prevName} was updated successfully`
      : `${prevName} was renamed to ${newName} successfully`;

  return {
    title: type === 'file' ? 'File updated!' : 'Folder updated!',
    message,
    type: NotificationType.SUCCESS,
  };
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

export const deleteSuccessMessage = (
  name: string,
  type: FileType,
): ToastMessage => {
  return {
    title: `${type === 'file' ? 'File' : 'Folder'} deleted!`,
    message: `${name} was deleted successfully`,
    type: NotificationType.SUCCESS,
  };
};

export const downloadSuccessMessage = (name: string): ToastMessage => {
  return {
    title: 'File downloaded!',
    message: `${name} has been downloaded successfully`,
    type: NotificationType.SUCCESS,
  };
};

export const downloadErrorMessage: ToastMessage = {
  title: 'Download error',
  message: 'An error ocurred while downloading your file, try again later',
  type: NotificationType.ERROR,
};

export const createFolderSuccessMessage = (name: string): ToastMessage => {
  return {
    title: 'Folder craeted!',
    message: `"${name}" was created successfully!`,
    type: NotificationType.SUCCESS,
  };
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
  message: "Kio will shared your file as soon as it's ready",
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

// Edit Profile
export const savedProfileChangesSuccessMessage: ToastMessage = {
  title: 'Saved changes',
  message: 'Your account has been updated successfully',
  type: NotificationType.SUCCESS,
};

export const nothingToSaveInfoMessage: ToastMessage = {
  title: 'Nothing to save',
  message: "There's nothing to change as no changes have been made",
  type: NotificationType.INFO,
};

// Miscelaneous
export const loadContentError = (name: string): ToastMessage => {
  return {
    title: 'Load error',
    message: `Kio was not able to load ${name}'s contents`,
    type: NotificationType.ERROR,
  };
};

export const logoutSuccessMessage: ToastMessage = {
  title: 'See you later!',
  message: "You've been logged out successfully",
  type: NotificationType.SUCCESS,
};

export const genericErrorMessage: ToastMessage = {
  title: 'Oops...',
  message: 'An error ocurred, try again later',
  type: NotificationType.ERROR,
};

export const unitSizeLoadErrorMessage: ToastMessage = {
  title: 'Load error',
  message: 'Kio could not retrieve information about your unit',
  type: NotificationType.ERROR,
};

export const passwordConfirmationErrorMessage: ToastMessage = {
  title: 'Save error',
  message: 'Passwords do not match',
  type: NotificationType.ERROR,
};

export const favoriteResourceSuccessMessage = (
  name: string,
  state: boolean,
): ToastMessage => {
  return {
    title: state ? 'Favorited!' : 'Unfavorited!',
    message: `${name} has been ${
      state ? 'favorited' : 'unfavorited'
    } successfully`,
    type: NotificationType.SUCCESS,
  };
};

// Coowner
export const coownerAddSuccessMessage: ToastMessage = {
  title: 'Coowner added!',
  message: 'Folder coowners have been added successfully',
  type: NotificationType.SUCCESS,
};

export const coownerAddSelfErrorMessage: ToastMessage = {
  title: 'Add error',
  message: 'You can not add yourself as a coowner of this folder',
  type: NotificationType.WARNING,
};

export const coownerAlreadyExist: ToastMessage = {
  title: 'Oops!',
  message: 'This user is already a coowner of this folder',
  type: NotificationType.WARNING,
};

export const coownerAddDuplicateErrorMessage: ToastMessage = {
  title: 'Add error',
  message: 'You can not add a coowner twice',
  type: NotificationType.WARNING,
};

export const coownerNothingToAddMessage: ToastMessage = {
  title: 'Nothing?',
  message: 'No coowners have been added',
  type: NotificationType.INFO,
};
