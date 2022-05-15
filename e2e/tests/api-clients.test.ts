import { createClient, createStatelessClient, endpoint } from '../utils/clients';
import {
  Client,
  GqlApiClient,
  StatelessClient,
  createStatelessClient as createCustomStatelessClient,
} from '../../src';
import { validUser } from '../utils/users';
import { expectFailure, expectQueryResolves } from '../utils/expectQuery';
import fetch from 'node-fetch';

const user1 = validUser();
const user2 = validUser();

console.log({ user1, user2 });

describe('E2E API Client Tests', () => {
  let client: StatelessClient;
  let authClient1: Client;
  let authClient2: Client;
  let apiClient1: GqlApiClient;
  let apiClient2: GqlApiClient;

  beforeAll(async () => {
    client = await createStatelessClient();
    authClient1 = await createClient(user1);
    authClient2 = await createClient(user2);
  });

  describe('Authorization', () => {
    it('should require authorization for myApiClients', () =>
      expectFailure(
        client.myApiClients(
          `{
            appName
            description
          }`,
        ),
      ).toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: "Unauthorized: Authorization header must be 'Bearer <token>'",
          },
        ],
      }));

    it('should require authorization for findApiClient', () =>
      expectFailure(
        client.findApiClient(
          `{
            appName
            description
          }`,
          {
            id: 'some-id',
          },
        ),
      ).toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: "Unauthorized: Authorization header must be 'Bearer <token>'",
          },
        ],
      }));

    it('should require authorization for createApiClient', () =>
      expectFailure(
        client.createApiClient(
          `{
            appName
            description
          }`,
          {
            client: { appName: 'Example', description: 'Example' },
          },
        ),
      ).toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: "Unauthorized: Authorization header must be 'Bearer <token>'",
          },
        ],
      }));

    it('should require authorization for updateApiClient', () =>
      expectFailure(
        client.updateApiClient(
          `{
            appName
            description
          }`,
          {
            id: 'some-id',
            changes: { appName: 'Example', description: 'Example' },
          },
        ),
      ).toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: "Unauthorized: Authorization header must be 'Bearer <token>'",
          },
        ],
      }));

    it('should require authorization for deleteApiClient', () =>
      expectFailure(
        client.deleteApiClient(
          `{
            appName
            description
          }`,
          {
            id: 'some-id',
          },
        ),
      ).toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: "Unauthorized: Authorization header must be 'Bearer <token>'",
          },
        ],
      }));
  });

  describe('Creating Clients', () => {
    it('should allow creating clients', async () => {
      const appName1 = 'Test 1';
      const description1 = 'Some description 1';
      apiClient1 = await authClient1.createApiClient(
        `{
          id
          appName
          description 
        }`,
        {
          client: { appName: appName1, description: description1 },
        },
      );
      expect(apiClient1).toEqual({
        id: expect.any(String),
        appName: appName1,
        description: description1,
      });

      const appName2 = 'Test 2';
      const description2 = 'Some description 2';
      apiClient2 = await authClient2.createApiClient(
        `{
          id
          appName
          description
        }`,
        {
          client: { appName: appName2, description: description2 },
        },
      );
      expect(apiClient2).toEqual({
        id: expect.any(String),
        appName: appName2,
        description: description2,
      });
    });
  });

  describe('My Clients', () => {
    it("should only return the user's clients", async () => {
      await expectQueryResolves(
        authClient1.myApiClients(
          `{
            id
            appName
            description
          }`,
        ),
      ).toEqual([apiClient1]);

      await expectQueryResolves(
        authClient2.myApiClients(
          `{
            id
            appName
            description
          }`,
        ),
      ).toEqual([apiClient2]);
    });
  });

  describe('Getting Client', () => {
    it('should be able to find the client you own', () =>
      expectQueryResolves(
        authClient1.findApiClient(
          `{
            id
            appName
            description
          }`,
          {
            id: apiClient1.id,
          },
        ),
      ).toEqual(apiClient1));

    it('should not find api clients other users own', () =>
      expectFailure(
        authClient1.findApiClient(
          `{
              id
              appName
              description
            }`,
          {
            id: apiClient2.id,
          },
        ),
      ).toEqual({
        errors: [{ message: 'API client not found' }],
        graphql: true,
        status: 200,
      }));
  });

  describe('Using Client IDs', () => {
    it('should not allow requests without a client id', async () => {
      const c = createCustomStatelessClient({
        baseUrl: endpoint,
        clientId: '',
        // @ts-expect-error: Fetch types don't match
        fetch,
      });

      await expectFailure(
        c.findUserByUsername(`{ username }`, { username: user1.username }),
      ).toEqual({
        errors: [{ message: 'The X-Client-ID header must be passed' }],
        graphql: true,
        status: 200,
      });
    });

    it('should not allow using random strings for client ids', async () => {
      const c = createCustomStatelessClient({
        baseUrl: endpoint,
        clientId: 'some-client',
        // @ts-expect-error: Fetch types don't match
        fetch,
      });

      await expectFailure(
        c.findUserByUsername(`{ username }`, { username: user1.username }),
      ).toEqual({
        errors: [{ message: 'Invalid X-Client-ID header, API client not found' }],
        graphql: true,
        status: 200,
      });
    });

    it('should allow using client IDs', async () => {
      const c = createCustomStatelessClient({
        baseUrl: endpoint,
        clientId: apiClient1.id,
        // @ts-expect-error: Fetch types don't match
        fetch,
      });

      await expectQueryResolves(
        c.findUserByUsername(`{ username }`, { username: user1.username }),
      ).toEqual({
        username: user1.username,
      });
    });
  });

  describe('Updating Clients', () => {
    it('should allow updating your own client', () =>
      expectQueryResolves(
        authClient1.updateApiClient(
          `{
            id
            appName
            description
          }`,
          {
            id: apiClient1.id,
            changes: { appName: apiClient1.appName },
          },
        ),
      ).toEqual(apiClient1));

    it('should not find api clients other users own', () =>
      expectFailure(
        authClient1.updateApiClient(
          `{
              id
              appName
              description
            }`,
          {
            id: apiClient2.id,
            changes: { appName: apiClient1.appName },
          },
        ),
      ).toEqual({
        errors: [{ message: 'API client not found' }],
        graphql: true,
        status: 200,
      }));
  });

  describe('Deleting Clients', () => {
    it('should allow deleting your own client', () =>
      expectQueryResolves(
        authClient1.deleteApiClient(
          `{
            id
            deletedAt
            deletedBy {
              username
            }
            appName
            description
          }`,
          {
            id: apiClient1.id,
          },
        ),
      ).toEqual({
        ...apiClient1,
        deletedAt: expect.any(String),
        deletedBy: {
          username: user1.username,
        },
      }));

    it('should not find api clients other users own', () =>
      expectFailure(
        authClient1.deleteApiClient(
          `{
            id
            appName
            description
          }`,
          {
            id: apiClient2.id,
          },
        ),
      ).toEqual({
        errors: [{ message: 'API client not found' }],
        graphql: true,
        status: 200,
      }));
  });
});
