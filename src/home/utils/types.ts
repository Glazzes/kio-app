export enum TypingEvent {
  IS_TYPING = 'Is.Typing',
  END_TYPING = 'End.Typing',
}

export enum UpdateFolderEvent {
  ADD_FILES = 'Add.File',
  DELETE_FILES = 'Delete.Files',
  ADD_FOLDER = 'Add.Folder',
  DELETE_FOLDERS = 'Delete.Folders',
  UPDATE_PREVIEW = 'Update.Preview',
  UPDATE_APPBAR = 'Update.Appbar',
}

export enum HomeEvents {
  HIDE_APPBAR = 'Hide.Appbar',
}

export type SelectionEvent = {
  from: string;
  item: string;
};
