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

## Publishing

Run the [publish]() workflow to bump the version, create the tag and release, and deploy to github packages

For fully manual deployments, bump the version and tag the commit yourself, then force the deployment in the publish workflow popup.

```bash
$EDITOR package.json
git commit -am "chore(release): vX.Y.Z"
git tag vX.Y.Z
```

## Testing

All tests are E2E tests because all code is generated. It uses a script to setup, run, and teardown the tests (`e2e/index.ts`). Tests are ran using Jest.

> Note that setup and teardown are not using jest. They are ran manually because the custom jest environment that skips the rest of the tests on a failure also skips the final teardown script, which is not what we want

Docker compose is used to spin up a database and the actual backend application. It is a clean database for every test run, but the tests are cumulative per file.

Jest can control the order the individual tests in a file are ran in, but the order of files cannot be controlled.

If you want to test against a local image, run the following:

```bash
# build the "anime-skip/backend/api:dev" image
cd /path/to/backend/repo
make build

# Use that image in the tests
cd /path/to/this/repo
yarn test:e2e:dev
```

To run tests against the current production application, just run:

```bash
# Pull down and run using the "anime-skip/backend/api:prod" image
yarn test:e2e
```
