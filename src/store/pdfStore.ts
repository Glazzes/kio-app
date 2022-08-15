import create from 'zustand';

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

type Store = {
  content: PdfContent[];
  indexes: Indexes;
  setContents: (contents: PdfContent[]) => void;
  setIndexes: (indexes: Indexes) => void;
};

const usePdfStore = create<Store>(set => ({
  content: [],
  indexes: {},
  setContents: (contents: PdfContent[]) =>
    set(state => ({...state, content: contents})),
  setIndexes: (indexes: Indexes) => set(state => ({...state, indexes})),
}));

export default usePdfStore;
