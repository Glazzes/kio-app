export enum TypingEvent {
  IS_TYPING = 'Is.Typing',
  END_TYPING = 'End.Typing',
}

export enum HomeEvents {
  HIDE_APPBAR = 'Hide.Appbar',
}

export type SelectionEvent = {
  from: string;
  item: string;
};
