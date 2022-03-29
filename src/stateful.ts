import { ClientPtr, createStatefulFetch, DEFAULT_FETCH } from './fetch';
import { createStatelessClient, StatelessClient } from './stateless';
import { AsyncStorage } from './storage';
import { Config } from './types';

type QueryVars<T extends keyof StatelessClient> = NonNullable<Parameters<StatelessClient[T]>[1]>;
type QueryResult<T extends keyof StatelessClient> = ReturnType<StatelessClient[T]>;

/**
 * The return type of `createClient`. This client manages your access token, refresh token, and user
 * automatically.
 */
export type Client = ReturnType<typeof createClient>;

function getDefaultStorage(): AsyncStorage {
  if (typeof localStorage == null)
    throw Error(
      'localStorage is not defined. Pass a custom implementation of TokenStorage via config.tokenStorage',
    );
  return localStorage;
}

export function createClient(config: Config) {
  const { fetch = DEFAULT_FETCH, baseUrl, clientId, storage = getDefaultStorage() } = config;

  const clientPtr = {} as ClientPtr;

  const statelessClient = createStatelessClient({
    baseUrl,
    clientId,
    fetch: createStatefulFetch(fetch, storage, clientPtr),
  });

  function withSetQuery<T extends keyof StatelessClient>(
    ogMethod: StatelessClient[T],
    queryString: string,
  ): (variables: QueryVars<T>, config?: RequestInit) => QueryResult<T> {
    return (variables: QueryVars<T>, config?: RequestInit): QueryResult<T> => {
      // @ts-expect-error: complex type parameters
      return ogMethod(queryString, variables, config);
    };
  }

  const loginDataQuery = `{
    authToken
    refreshToken
    account {
      id
      username
      email
      createdAt
      deletedAt
      emailVerified
      profileUrl
      role
    }
  }`;

  const client = {
    ...statelessClient,
    // tokens and user info are pulled out of these queries, so don't allow custom query strings
    login: withSetQuery<'login'>(statelessClient.login, loginDataQuery),
    loginRefresh: withSetQuery<'loginRefresh'>(statelessClient.loginRefresh, loginDataQuery),
    createAccount: withSetQuery<'createAccount'>(statelessClient.createAccount, loginDataQuery),
    changePassword: withSetQuery<'changePassword'>(statelessClient.changePassword, loginDataQuery),
    resetPassword: withSetQuery<'resetPassword'>(statelessClient.resetPassword, loginDataQuery),
  };
  clientPtr.client = client;

  return client;
}
