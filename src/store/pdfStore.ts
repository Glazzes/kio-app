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
  name: string;
  content: PdfContent[];
  indexes: Indexes;
};

export const pdfState = proxy<State>({
  name: '',
  content: [],
  indexes: {},
});

export const setPdfName = (name: string) => {
  pdfState.name = name;
};

export function setPdfContents(contents: PdfContent[]) {
  pdfState.content = contents;
}

export function setPdfIndexes(indexes: Indexes) {
  pdfState.indexes = indexes;
}
