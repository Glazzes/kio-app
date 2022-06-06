import create from 'zustand';

type Store = {
  accessToken: string;
  refreshToken: string;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
};

const useAuthStore = create<Store>(set => ({
  accessToken: '',
  refreshToken: '',
  setAccessToken: accessToken => set(state => ({...state, accessToken})),
  setRefreshToken: refreshToken => set(state => ({...state, refreshToken})),
}));

export default useAuthStore;
