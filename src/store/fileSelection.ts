import {proxy} from 'valtio';
import {File, Folder} from '../shared/types';

type State = {
  locked: boolean;
  inProgress: boolean;
  source: string | null;
  files: File[];
  folders: Folder[];
};

export const fileSelectionState = proxy<State>({
  locked: false,
  inProgress: false,
  source: '',
  files: [],
  folders: [],
});

export const updateSourceSelection = (folderId: string) => {
  if (!fileSelectionState.source) {
    fileSelectionState.source = folderId;
  }
};

export const addFileToSelection = (file: File) => {
  fileSelectionState.files.push(file);
  fileSelectionState.inProgress = true;
};

export const addFolderToSelection = (folder: Folder) => {
  fileSelectionState.folders.push(folder);
  fileSelectionState.inProgress = true;
};

export const removeFileFromSelection = (id: string) => {
  fileSelectionState.files = fileSelectionState.files.filter(f => f.id !== id);

  if (
    fileSelectionState.files.length === 0 &&
    fileSelectionState.folders.length === 0
  ) {
    fileSelectionState.inProgress = false;
  }
};

export const removeFolderFromSelection = (id: string) => {
  fileSelectionState.folders = fileSelectionState.folders.filter(
    f => f.id !== id,
  );

  if (
    fileSelectionState.files.length === 0 &&
    fileSelectionState.folders.length === 0
  ) {
    fileSelectionState.inProgress = false;
  }
};

export const setSelectionDestination = (destination: string) => {
  fileSelectionState.source = destination;
};

export const toggleSelectionLock = () => {
  fileSelectionState.locked = !fileSelectionState.locked;
  fileSelectionState.inProgress = false;
};

export const clearFileSelection = () => {
  fileSelectionState.files = [];
  fileSelectionState.folders = [];
  fileSelectionState.inProgress = false;
  fileSelectionState.source = null;
};
