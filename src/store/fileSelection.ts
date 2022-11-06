import {proxy} from 'valtio';
import {File} from '../shared/types';

type State = {
  locked: boolean;
  destination: string;
  files: File[];
  folders: string[];
};

export const fileSelectionState = proxy<State>({
  locked: false,
  destination: '',
  files: [],
  folders: [],
});

export const addFileToSelection = (file: File) => {
  fileSelectionState.files.push(file);
};

export const removeFileFromSelection = (id: string) => {
  fileSelectionState.files = fileSelectionState.files.filter(f => f.id !== id);
};

export const setSelectionDestination = (destination: string) => {
  fileSelectionState.destination = destination;
};

export const toggleSelectionLock = () => {
  fileSelectionState.locked = !fileSelectionState.locked;
};

export const clearSelection = () => {
  fileSelectionState.files = [];
  fileSelectionState.folders = [];
};
