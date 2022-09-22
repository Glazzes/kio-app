import {proxy} from 'valtio';

type State = {
  count: number;
  items: string[];
};

export const selectionState = proxy<State>({count: 0, items: []});
