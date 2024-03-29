# Typescript API Client

A simple, fetch based API client that ships with types and powers all of Anime Skip!

This library is generated based on the current introspection result from `test.api.anime-skip.com`.

```bash
echo "@anime-skip:registry=https://npm.pkg.github.com/" >> .npmrc
npm i @anime-skip/api-client
```

> This is an alternative to Apollo or any other GraphQL client library out there! Use something else if you prefer, this is by no means a requirement to consume the API

<br/>

## Contributing

See the [contributing guidelines](https://github.com/anime-skip/docs/wiki) for all of Anime Skip

<br/>

## Usage

To call the api, you need a client id! Checkout the [API docs](https://www.anime-skip.com/api) to get one. The client id used below is a shared one that anyone can use, but it is heavily rate limited.

```ts
import { createClient } from '@anime-skip/api-client';
import md5 from 'md5';

// Create a fully managed client
// (tokens will be refreshed automatically)

const client = createClient({
  baseUrl: 'https://test.api.anime-skip.com',
  clientId: 'ZGfO0sMF3eCwLYf8yMSCJjlynwNGRXWE',
});

// Call the API

const { status } = await client.healthCheck();
const { authToken } = await client.login({
  usernameEmail: 'username',
  passwordHash: md5('password'),
});
const { authToken } = await client.searchShows(`{ id name }`, { search: 're:' });
```

The methods exposed on the client match the queries and mutation names used in the graphql. For documentation checkout the [api playground](http://test.api.anime-skip.com/graphiql), but it's also include as JS Doc!

Full types are also available as named exports all prefixed with `Gql`. Extend them, pick from them, or use them directly, whatever you prefer!

```ts
import { GqlAccount, GqlEpisode, GqlCreateTimestampArgs, ... } from '@anime-skip/api-client';
```

<br/>

## E2E Tests

This is where the E2E tests of the API are located. They test both the API and this client library. Contributors should know how to run and update them, but making changes to the backend is not possible because it is private.

> If you think there's a problem with the API, head over to the support page to get help: <https://www.anime-skip.com/support>

All tests are ran inside a local docker environment. To start them, run the following command:

```bash
pnpm test:e2e
```

Between each test suite (file), the database is reset. So if you create a new test suite, make sure you initialize test data and accounts within that file

Tests are orchestrated by `e2e/index.ts`. It spins the docker environment, runs the jest test suite, and stops docker.

### Backend Devs Only

To run the tests against a development version of the api service, first build the dev image, then run the dev tests script

```bash
cd /path/to/api-service
make
cd /path/to/this/project
pnpm test:e2e:dev
```
