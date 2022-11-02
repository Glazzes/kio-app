export enum TypingEvent {
  IS_TYPING = 'Is.Typing',
  END_TYPING = 'End.Typing',
}

export enum UpdateFolderEvent {
  ADD_FILE = 'Add.File',
  REMOVE_FILE = 'Remove.File',
  ADD_FOLDER = 'Add.Folder',
  REMOVE_FOLDER = 'Remove.Folder',
}

export enum HomeEvents {
  HIDE_APPBAR = 'Hide.Appbar',
}

export type SelectionEvent = {
  from: string;
  item: string;
};
