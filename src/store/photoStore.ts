import create from 'zustand';

type Store = {
  photos: {[id: string]: string};
  mutate: (newStr: string) => void;
};

const usePhotoStore = create<Store>(set => ({
  photos: {},
  mutate: (photo: string) =>
    set(state => ({...state, photos: {[photo]: photo, ...state.photos}})),
}));

export default usePhotoStore;
