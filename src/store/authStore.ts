import {proxy} from 'valtio';

type User = {
  username: string;
  email: string;
  profilePicture: string;
};

type Store = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

const authState = proxy<Store>({
  user: {} as User,
  accessToken: '',
  refreshToken: '',
});

export default authState;
