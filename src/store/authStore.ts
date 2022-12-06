import {proxy} from 'valtio';
import {User} from '../shared/types';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type Store = {
  user: User;
  tokens: Tokens;
};

const authState = proxy<Store>({
  user: {} as User,
  tokens: {accessToken: '', refreshToken: ''},
});

export const updateUser = (user: User) => {
  authState.user = user;
};

export const updateTokens = (tokens: Tokens) => {
  authState.tokens.accessToken = tokens.accessToken;
  authState.tokens.refreshToken = tokens.refreshToken;
};

export default authState;
