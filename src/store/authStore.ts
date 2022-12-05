import {proxy} from 'valtio';
import {User} from '../shared/types';

type Store = {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

const authState = proxy<Store>({
  user: {} as User,
  tokens: {accessToken: '', refreshToken: ''},
});

export default authState;
