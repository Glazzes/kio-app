export enum TypingEvent {
  IS_TYPING = 'Is.Typing',
  END_TYPING = 'End.Typing',
}

export enum UpdateFolderEvent {
  ADD_FILES = 'Add.File',
  REMOVE_FILES = 'Remove.File',
  ADD_FOLDER = 'Add.Folder',
  REMOVE_FOLDERS = 'Remove.Folder',
}

export enum HomeEvents {
  HIDE_APPBAR = 'Hide.Appbar',
}

export type SelectionEvent = {
  from: string;
  item: string;
};
