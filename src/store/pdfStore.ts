import {proxy} from 'valtio';

export type PdfContent = {
  children: PdfContent[];
  pageIdx: number;
  title: string;
  mNativePtr: number;
};

export type SubIndex = {pageIdx: number; prev: number; next: number};

export type TopLevelIndex = {
  prev: number;
  next: number;
  subIndexes: SubIndex[];
};
export type Indexes = {
  [id: number]: TopLevelIndex;
};

type State = {
  content: PdfContent[];
  indexes: Indexes;
};

export const pdfState = proxy<State>({
  content: [],
  indexes: {},
});

export function setPdfContents(contents: PdfContent[]) {
  pdfState.content = contents;
}

export function setPdfIndexes(indexes: Indexes) {
  pdfState.indexes = indexes;
}
