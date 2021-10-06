/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AxiosInstance } from 'axios';
import md5 from 'md5';
import createAnimeSkipClient from '../../src';

export const endpoint = 'http://localhost:8080';
export const clientId = 'ZGfO0sMF3eCwLYf8yMSCJjlynwNGRXWE';
export const recaptchaResponse = 'password1';

export type ClientWithoutAxios = ReturnType<typeof createClient>['client'];

export function createClient() {
  const { axios, ...client } = createAnimeSkipClient(endpoint, clientId);
  return { axios, client };
}

export function authorizeClient(axios: AxiosInstance, token: string): void {
  axios.interceptors.request.use(config => {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  });
}

export async function createAuthorizedClient(user: {
  username: string;
  password: string;
  email: string;
}) {
  const { axios, client } = createClient();
  const { authToken } = await client.createAccount('{ authToken }', {
    username: user.username,
    email: user.email,
    passwordHash: md5(user.password),
    recaptchaResponse,
  });
  authorizeClient(axios, authToken);
  return { axios, client };
}
