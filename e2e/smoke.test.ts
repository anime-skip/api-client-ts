import expect from 'expect';
import * as docker from './docker';
import createAnimeSkipClient from '../src';
import md5 from 'md5';
import { mockApi, MockApi } from './mock-api';

const endpoint = 'http://localhost:8081';
const clientId = 'some-client-id';
const { axios, ...client } = createAnimeSkipClient(endpoint, clientId);
const { axios: axiosWithAuth, ...clientWithAuth } = createAnimeSkipClient(endpoint, clientId);

let emailServer: MockApi;
async function setupMockApis() {
  const mocks = await Promise.all([mockApi(9100)]);
  emailServer = mocks[0];
}

const user = {
  username: 'user',
  email: 'user@test.com',
  password: 'password',
};
const recaptchaResponse = 'password1';
const invalidRecaptchaResponse = 'some-other-response';

function login() {
  return client.login(
    `{
      authToken
      refreshToken
    }`,
    {
      passwordHash: md5(user.password),
      usernameEmail: user.username,
    },
  );
}

function setupAuthorizedClient(token: string) {
  axiosWithAuth.interceptors.request.use(config => {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  });
}

describe('E2E API Calls', function () {
  this.timeout('60s');

  before(async () => {
    await docker.startServices(axios);
    await setupMockApis();
  });
  after(async () => {
    await docker.stopServices();
    emailServer.stop();
  });

  beforeEach(() => {
    emailServer.clear();
  });

  it('Health check', async () => {
    const { status } = await axios.get('/status');
    expect(status).toEqual(200);
  });

  describe('Creating Accounts', () => {
    it('Fail when username is invalid', () =>
      expect(
        client.createAccount(
          `{
            account { username }
          }`,
          {
            username: 'a',
            email: user.email,
            passwordHash: md5(user.password),
            recaptchaResponse,
          },
        ),
      ).rejects.toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: 'Username must be at least 3 characters long',
            path: ['createAccount'],
          },
        ],
      }));

    it('Fail when email is invalid', () =>
      expect(
        client.createAccount(
          `{
            authToken
          }`,
          {
            username: user.username,
            email: 'not-an-email',
            passwordHash: md5(user.password),
            recaptchaResponse,
          },
        ),
      ).rejects.toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: 'Email is not valid',
            path: ['createAccount'],
          },
        ],
      }));

    it('Fail with an invalid recaptcha response', () =>
      expect(
        client.createAccount(
          `{
            authToken
          }`,
          {
            username: user.username,
            email: user.email,
            passwordHash: md5(user.password),
            recaptchaResponse: invalidRecaptchaResponse,
          },
        ),
      ).rejects.toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: 'Recaptcha validation failed',
            path: ['createAccount'],
          },
        ],
      }));

    it("Create 'user' account", async () => {
      await expect(
        client.createAccount(
          `{
            authToken
            refreshToken
            account {
              username
            }
          }`,
          {
            email: user.email,
            passwordHash: md5(user.password),
            recaptchaResponse,
            username: user.username,
          },
        ),
      ).resolves.toEqual({
        authToken: expect.any(String),
        refreshToken: expect.any(String),
        account: {
          username: 'user',
        },
      });
      expect(emailServer.requests.POST).toEqual([
        {
          path: '/welcome',
          body: {
            emails: [user.email],
            username: user.username,
          },
          headers: expect.objectContaining({
            authorization: 'Secret some-email-secret',
          }),
        },
        {
          path: '/verification',
          body: {
            emails: [user.email],
            token: expect.any(String),
          },
          headers: expect.objectContaining({
            authorization: 'Secret some-email-secret',
          }),
        },
      ]);
    });
  });

  describe('login', () => {
    it('should not login with the wrong username', () =>
      expect(
        client.login(
          `{
            authToken
          }`,
          {
            passwordHash: md5(user.password),
            usernameEmail: 'another-user',
          },
        ),
      ).rejects.toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: 'Bad login credentials',
            path: ['login'],
          },
        ],
      }));

    it('should not login with the wrong password', () =>
      expect(
        client.login(
          `{
            authToken
          }`,
          {
            passwordHash: md5('another-password'),
            usernameEmail: user.username,
          },
        ),
      ).rejects.toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: 'Bad login credentials',
            path: ['login'],
          },
        ],
      }));

    it('should login with the correct username and password', async () =>
      expect(login()).resolves.toEqual({
        authToken: expect.any(String),
        refreshToken: expect.any(String),
      }));

    it('should login with the correct email and password', () =>
      expect(
        client.login(
          `{
            authToken
          }`,
          {
            passwordHash: md5(user.password),
            usernameEmail: user.email,
          },
        ),
      ).resolves.toEqual({
        authToken: expect.any(String),
      }));

    it('should login with a refresh token', async () => {
      const data = await login();
      if (data == null) throw Error('Could not login to get refresh token');
      await expect(
        client.loginRefresh(
          `{
            authToken
          }`,
          {
            refreshToken: data.refreshToken,
          },
        ),
      ).resolves.toEqual({
        authToken: expect.any(String),
      });
    });

    after(async () => {
      const data = await login();
      if (data == null) throw Error('Could not login after login tests passed');
      setupAuthorizedClient(data.authToken);
    });
  });

  describe('email validation', () => {
    it('New accounts are unverified', () =>
      expect(
        clientWithAuth.account(`{
          username
          email
          emailVerified
        }`),
      ).resolves.toEqual({
        username: 'user',
        email: 'user@test.com',
        emailVerified: false,
      }));

    it('Accounts can become verified', async () => {
      await expect(clientWithAuth.resendVerificationEmail('')).resolves.toBe(true);
      expect(emailServer.requests.POST).toEqual([
        {
          path: '/verification',
          body: {
            emails: [user.email],
            token: expect.any(String),
          },
          headers: expect.any(Object),
        },
      ]);
      await expect(
        clientWithAuth.verifyEmailAddress(
          `{
            username
            emailVerified
          }`,
          {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            validationToken: emailServer.requests.POST![0].body.token,
          },
        ),
      ).resolves.toEqual({
        username: user.username,
        emailVerified: true,
      });
    });
  });
});
