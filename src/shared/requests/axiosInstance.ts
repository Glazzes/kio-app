import axios, {AxiosError, AxiosResponse} from 'axios';
import authState from '../../store/authStore';
import {mmkv} from '../../store/mmkv';
import {TokenResponse} from '../types';
import {HOST as host} from '@env';
import {apiAuthTokenUrl} from './contants';

const axiosInstance = axios.create({
  baseURL: host,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getNewtokenPair = (
  refreshToken: string,
): Promise<AxiosResponse<TokenResponse>> => {
  return axios.post(`${host}${apiAuthTokenUrl}`, undefined, {
    params: {
      refresh_token: refreshToken,
    },
  });
};

axiosInstance.interceptors.request.use(config => {
  const tokensString = mmkv.getString('tokens');
  if (tokensString !== undefined) {
    const tokens: TokenResponse = JSON.parse(tokensString);

    // @ts-ignore
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const config = error.config;
    // @ts-ignore
    if (error.response?.status === 401 && !config.retry) {
      // @ts-ignore
      config.retry = true;

      try {
        const tokens: TokenResponse = JSON.parse(mmkv.getString('tokens')!!);
        const {data} = await getNewtokenPair(tokens.refreshToken);

        authState.tokens.accessToken = data.accessToken;
        authState.tokens.refreshToken = data.refreshToken;
        mmkv.set('tokens', JSON.stringify(data));

        return axiosInstance(config);
      } catch (e) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export {axiosInstance};
