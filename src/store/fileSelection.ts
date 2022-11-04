import {proxy} from 'valtio';
import {File} from '../shared/types';

type State = {
  locked: boolean;
  destination: string;
  files: File[];
  folders: string[];
};

export const fileSelectionStore = proxy<State>({
  locked: false,
  destination: '',
  files: [],
  folders: [],
});

export const addFileToSelection = (file: File) => {
  fileSelectionStore.files.push(file);
};

export const removeFileFromSelection = (id: string) => {
  fileSelectionStore.files = fileSelectionStore.files.filter(
    file => file.id === id,
  );
};

export const setSelectionDestination = (destination: string) => {
  fileSelectionStore.destination = destination;
};

export const toggleSelectionLock = () => {
  fileSelectionStore.locked = !fileSelectionStore.locked;
};
