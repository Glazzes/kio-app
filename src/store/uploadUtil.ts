import create from 'zustand';

type UploadFile = {
  file: {
    name: string;
    filename: string;
    fileType: string;
    uri: string;
  };
  metadata: {
    duration: number | undefined;
    width: number | undefined;
    height: number | undefined;
  };
};

type Store = {
  files: UploadFile[];
  pushFile: (file: UploadFile) => void;
  numberOfFiles: number;
  isReadyToUpload: boolean;
  setFilesToUpload: (numberOfFiles: number) => void;

  reset: () => void;
};

const useUploadStore = create<Store>(set => ({
  files: [],
  numberOfFiles: 0,
  isReadyToUpload: false,

  pushFile: file =>
    set(state => {
      state.files.push(file);

      console.log(file);

      return {
        ...state,
        isReadyToUpload: state.files.length === state.numberOfFiles,
      };
    }),

  setFilesToUpload: numberOfFiles => set(state => ({...state, numberOfFiles})),

  reset: () =>
    set(state => ({
      ...state,
      files: [],
      numberOfFiles: 0,
      isReadyToUpload: false,
    })),
}));

export default useUploadStore;
