import {proxy} from 'valtio';
import {Dimension} from '../shared/types';

export type Picture = {
  name: string;
  width: number;
  height: number;
};

type Selection = {
  [uri: string]: Picture;
};

type State = {
  takenPictures: Selection;
  selectedPictures: Selection;
};

export const pictureSelectionState = proxy<State>({
  takenPictures: {},
  selectedPictures: {},
});

// Taken
export const addTakenPicture = (uri: string, picture: Picture) => {
  pictureSelectionState.takenPictures[uri] = picture;
};

export const getTakenPicturesUris = () => {
  return Object.keys(pictureSelectionState.takenPictures);
};

export const updateTakenPictureDimensions = (
  uri: string,
  dimensions: Dimension,
) => {
  pictureSelectionState.takenPictures[uri].width = dimensions.width;
  pictureSelectionState.takenPictures[uri].height = dimensions.height;
};

export const removeSelectedPicturesFromTakenPictures = (uris: string[]) => {
  for (let uri of uris) {
    delete pictureSelectionState.takenPictures[uri];
  }
};

// Selected
export const addPicturetoSelection = (uri: string) => {
  const pictureCopy = {...pictureSelectionState.takenPictures[uri]};
  pictureSelectionState.selectedPictures[uri] = pictureCopy;
};

export const removePictureFromSelection = (uri: string) => {
  delete pictureSelectionState.selectedPictures[uri];
};

export const removeSelectedPicturesFromTaken = (uris: string[]) => {
  for (let uri of uris) {
    delete pictureSelectionState.takenPictures[uri];
  }
};

export const clearPictureSelection = () => {
  pictureSelectionState.selectedPictures = {};
};
