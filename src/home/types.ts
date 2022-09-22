export enum TypingEvent {
  BEGIN_TYPING = 'Being.Typing',
  END_TYPING = 'End.Typing',
}

export enum HomeEvents {
  HIDE_APPBAR = 'Hide.Appbar',
}

export type SelectionEvent = {
  from: string;
  item: string;
};
