import { Client } from './stateful';
import { GqlResponse, GqlResponseError } from './types';
import { Mutex } from 'async-mutex';
import { GqlLoginData } from './stateless';
import { AsyncStorage } from './storage';

export type Fetch = typeof fetch;

export const DEFAULT_FETCH: Fetch =
  typeof window !== 'undefined'
    ? window.fetch
    : typeof self !== 'undefined'
    ? self.fetch
    : (undefined as unknown as Fetch);

export interface ClientPtr {
  client: Client;
}

/**
 * Query names that return access and refresh tokens
 */
const AUTH_QUERIES = ['login', 'loginRefresh', 'createAccount', 'changePassword', 'resetPassword'];

export function createStatefulFetch(
  baseFetch: Fetch,
  storage: AsyncStorage,
  clientPtr: ClientPtr,
): Fetch {
  const ACCESS_TOKEN_KEY = '@anime-skip/api-client#ACCESS_TOKEN';
  const REFRESH_TOKEN_KEY = '@anime-skip/api-client#REFRESH_TOKEN';
  const ACCOUNT_KEY = '@anime-skip/api-client#ACCOUNT';

  async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
    const token = await storage.getItem(ACCESS_TOKEN_KEY);
    const initWithAuth: RequestInit = {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${token}`,
      },
    };
    return baseFetch(input, initWithAuth);
  }

  function isAccessTokenExpired(res: Response, errors: GqlResponseError[]): boolean {
    return res.status === 200 && !!errors.find(e => e.message === 'Access token is expired');
  }

  const dataMutex = new Mutex();
  const setLoginData = (newLoginData: Partial<GqlLoginData>) =>
    dataMutex.runExclusive(async () => {
      if (newLoginData.account)
        await storage.setItem(ACCOUNT_KEY, JSON.stringify(newLoginData.account));
      else await storage.removeItem(ACCOUNT_KEY);

      if (newLoginData.authToken) await storage.setItem(ACCESS_TOKEN_KEY, newLoginData.authToken);
      else await storage.removeItem(ACCESS_TOKEN_KEY);

      if (newLoginData.refreshToken)
        await storage.setItem(REFRESH_TOKEN_KEY, newLoginData.refreshToken);
      else await storage.removeItem(REFRESH_TOKEN_KEY);
    });
  const logIn = (loginData: GqlLoginData) => setLoginData(loginData);
  const logOut = () => setLoginData({});

  const refreshingMutex = new Mutex();
  const refreshTokens = () =>
    refreshingMutex.runExclusive(async () => {
      const refreshToken = await storage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        await logOut();
      } else {
        // Data is persisted in `updateLoginData` when reading requests
        await clientPtr.client.loginRefresh({ refreshToken });
      }
    });

  function findLoginData(data: Record<string, unknown>): GqlLoginData | undefined {
    for (const [queryName, results] of Object.entries(data ?? {})) {
      if (AUTH_QUERIES.includes(queryName)) {
        return results as GqlLoginData;
      }
    }
  }

  return async (input, init) => {
    const res = await fetchWithAuth(input, init);
    const { data, errors } = (await res.clone().json()) as GqlResponse<any, any>;

    if (errors && isAccessTokenExpired(res, errors)) {
      await refreshTokens();
      return fetchWithAuth(input, init);
    }

    const loginData = findLoginData(data);
    if (loginData) await logIn(loginData);

    return res;
  };
}
