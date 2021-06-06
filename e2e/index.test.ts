import expect from 'expect';
import * as docker from './docker';
import { step } from 'mocha-steps';
import createAnimeSkipClient from '../src';
import md5 from 'md5';

const { axios, ...client } = createAnimeSkipClient('http://localhost:8081');

describe('E2E API Calls', function () {
  this.timeout('60s');

  before(async () => {
    await docker.startServices(axios);
  });
  after(async () => {
    await docker.stopServices();
  });

  step('Health check', async () => {
    const { status } = await axios.get('/status');
    expect(status).toEqual(200);
  });

  describe('Creating Accounts', () => {
    step('Fail when username is invalid', () =>
      expect(
        client.createAccount(
          `{
            username
          }`,
          {
            email: 'user@test.com',
            passwordHash: md5('password'),
            recaptchaResponse: 'password1',
            username: 'a',
          },
        ),
      ).rejects.toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: 'test',
            paths: ['usernames'],
          },
        ],
      }),
    );

    step('Fail when email is invalid', () =>
      expect(
        client.createAccount(
          `{
            authToken
          }`,
          {
            email: 'not-an-email',
            passwordHash: md5('password'),
            recaptchaResponse: 'password1',
            username: 'user',
          },
        ),
      ).rejects.toContainEqual({
        graphql: true,
        errors: [
          {
            message: 'test',
            paths: ['emails'],
          },
        ],
      }),
    );

    step("Create 'user' account", async () => {
      const loginData = await client.createAccount(
        `{
          authToken
          refreshToken
          account {
            username
          }
        }`,
        {
          email: 'user@test.com',
          passwordHash: md5('password'),
          recaptchaResponse: 'password1',
          username: 'user',
        },
      );
      expect(loginData).toEqual({
        authToken: expect.any(String),
        refreshToken: expect.any(String),
        account: {
          username: 'user',
        },
      });

      axios.interceptors.request.use(config => {
        return {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${loginData?.authToken}`,
          },
        };
      });
    });

    step('New accounts are unverified', async () => {
      const account = await client.account(`{
        username
        passwordHash
        email
        verified
      }`);
      expect(account).toEqual({
        username: 'user',
        passwordHash: expect.any(String),
        email: 'user@test.com',
        verified: false,
      });
    });
  });
});
