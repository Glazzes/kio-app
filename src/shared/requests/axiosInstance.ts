import axios, {AxiosError, AxiosResponse} from 'axios';
import authState from '../../store/authStore';
import {mmkv} from '../../store/mmkv';
import {TokenResponse} from '../types';

const baseURL = 'http://192.168.42.95:8080';

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getNewtokenPair = (
  refreshToken: string,
): Promise<AxiosResponse<TokenResponse>> => {
  return axios.post(`${baseURL}/api/v1/auth/token`, undefined, {
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
    if (error.response?.status === 401 && !config.retry) {
      config.retry = true;

      try {
        console.log('requesting token');
        console.log(config.url);
        const tokens: TokenResponse = JSON.parse(mmkv.getString('tokens')!!);
        const {data} = await getNewtokenPair(tokens.refreshToken);

        authState.tokens.accessToken = data.accessToken;
        authState.tokens.refreshToken = data.refreshToken;
        mmkv.set('tokens', JSON.stringify(data));

        return axiosInstance(config);
      } catch (e) {
        // @ts-ignore
        if (e.response.status !== 404) {
          console.log('Your refresh token has expired');
        }

        return Promise.reject(error);
      }
    }
  },
);