import create from 'zustand';

type User = {
  username: string;
  email: string;
  profilePicture: string;
};

type Store = {
  user: User;
  accessToken: string;
  refreshToken: string;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
};

const useAuthStore = create<Store>(set => ({
  user: {username: '', email: '', profilePicture: ''},
  accessToken: '',
  refreshToken: '',
  setAccessToken: accessToken => set(state => ({...state, accessToken})),
  setRefreshToken: refreshToken => set(state => ({...state, refreshToken})),
}));

export default useAuthStore;
