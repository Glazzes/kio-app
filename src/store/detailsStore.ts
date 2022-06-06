import create from 'zustand';

type Store = {
  object: any;
  mutate: (newStr: string) => void;
};

const useDetailsStore = create<Store>(set => ({
  object: 'Glaze',
  mutate: (newObject: any) => set(state => ({...state, object: newObject})),
}));

export default useDetailsStore;
