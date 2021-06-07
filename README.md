# `@anime-skip/axios-api`

A function based api client library that has methods for all the queries and mutations available
according to the current introspection result from `test.api.anime-skip.com`

## Usage

```ts
// api.ts
import { createAnimeSkipClient, GqlResponse } from '@anime-skip/axios-api';

const { axios, ...queries } = createAnimeSkipClient();

axios.interceptors.request.use(config => {
  return {
    ...config,
    headers: {
      ...config:
      // Some function that returns the current token
      Authorization: getToken(),
    }
  }
});

export {
  axios,
  ...queries,

  someCustomQuery(): Promise<any> {
    return axios.get(...);
  },
}
```

```ts
// actions.ts
import * as client from './api';

const actions = {
  async someAction() {
    await client.account();
  },
};
```
