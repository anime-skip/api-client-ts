import expect from 'expect';
import md5 from 'md5';
import { clearMockApis, emailServer, setupMockApis, stopMockApis } from '../utils/mock-apis';
import { healthCheck } from '../utils/connection';
import { expectFailure, expectQueryResolves as expectSuccess } from '../utils/expectQuery';
import {
  authorizeClient,
  clientId,
  ClientWithoutAxios,
  createAuthorizedClient,
  createClient,
  recaptchaResponse,
} from '../utils/clients';
import { validUser } from '../utils/users';

const invalidRecaptchaResponse = 'some-other-response';

describe('E2E API Calls', () => {
  beforeAll(setupMockApis);
  afterAll(stopMockApis);
  beforeEach(clearMockApis);

  it('Health check', async () => {
    const { axios: axiosWithoutAuth } = createClient();
    const response = await healthCheck(axiosWithoutAuth, clientId);
    expect(response).toMatchObject({ status: 200 });
  });

  describe('Creating Accounts', () => {
    const { createAccount } = createClient().client;
    const user = validUser();

    it('Fail when username is invalid', () =>
      expectFailure(
        createAccount(
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
      ).toEqual({
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
      expectFailure(
        createAccount(
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
      ).toEqual({
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
      expectFailure(
        createAccount(
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
      ).toEqual({
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
      await expectSuccess(
        createAccount(
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
      ).toEqual({
        authToken: expect.any(String),
        refreshToken: expect.any(String),
        account: {
          username: user.username,
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

    it('Cleanup and create untrimmed inputs', () => {
      const uncleanUser = validUser();

      return expectSuccess(
        createAccount(
          `{
            authToken
            refreshToken
            account {
              username
              email
            }
          }`,
          {
            email: ` ${uncleanUser.email} `,
            passwordHash: ` ${md5(uncleanUser.password)} `,
            recaptchaResponse,
            username: ` ${uncleanUser.username} `,
          },
        ),
      ).toEqual({
        authToken: expect.any(String),
        refreshToken: expect.any(String),
        account: {
          username: uncleanUser.username,
          email: uncleanUser.email,
        },
      });
    });
  });

  describe('login', () => {
    const existingUser = validUser('login');
    const { client } = createClient();

    beforeAll(async () => {
      await client.createAccount('{ authToken }', {
        email: existingUser.email,
        username: existingUser.username,
        passwordHash: md5(existingUser.password),
        recaptchaResponse,
      });
    });

    it('should not login with the wrong username', () =>
      expectFailure(
        client.login(`{ authToken }`, {
          passwordHash: md5(existingUser.password),
          usernameEmail: 'not-' + existingUser.username,
        }),
      ).toEqual({
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
      expectFailure(
        client.login(`{ authToken }`, {
          passwordHash: md5('not-' + existingUser.password),
          usernameEmail: existingUser.username,
        }),
      ).toEqual({
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
      expectSuccess(
        client.login(`{ authToken refreshToken }`, {
          passwordHash: md5(existingUser.password),
          usernameEmail: existingUser.username,
        }),
      ).toEqual({
        authToken: expect.any(String),
        refreshToken: expect.any(String),
      }));

    it('should login with the correct email and password', () =>
      expectSuccess(
        client.login(`{ authToken }`, {
          passwordHash: md5(existingUser.password),
          usernameEmail: existingUser.email,
        }),
      ).toEqual({
        authToken: expect.any(String),
      }));

    it('should login with trimmed username and password hash', () =>
      expectSuccess(
        client.login(`{ authToken }`, {
          passwordHash: ` ${md5(existingUser.password)} `,
          usernameEmail: ` ${existingUser.username} `,
        }),
      ).toEqual({
        authToken: expect.any(String),
      }));

    it('should login with trimmed email and password hash', () =>
      expectSuccess(
        client.login(`{ authToken }`, {
          passwordHash: ` ${md5(existingUser.password)} `,
          usernameEmail: ` ${existingUser.email} `,
        }),
      ).toEqual({
        authToken: expect.any(String),
      }));

    it('should login with a refresh token', async () => {
      const { refreshToken } = await client.login(`{ refreshToken }`, {
        passwordHash: md5(existingUser.password),
        usernameEmail: existingUser.username,
      });
      await expectSuccess(client.loginRefresh(`{ authToken }`, { refreshToken })).toEqual({
        authToken: expect.any(String),
      });
    });
  });

  describe('email validation', () => {
    it('New accounts are unverified', async () => {
      const newUser = validUser('new-user');
      const { client } = await createAuthorizedClient(newUser);

      return expectSuccess(
        client.account(`{
          username
          email
          emailVerified
        }`),
      ).toEqual({
        username: newUser.username,
        email: newUser.email,
        emailVerified: false,
      });
    });

    it('Fail with an invalid recaptcha response', async () => {
      const invalidRecaptchaUser = validUser('user-with-invalid-recaptcha');
      const { client } = await createAuthorizedClient(invalidRecaptchaUser);
      await expectFailure(
        client.resendVerificationEmail('', {
          recaptchaResponse: invalidRecaptchaResponse,
        }),
      ).toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: 'Recaptcha validation failed',
            path: ['resendVerificationEmail'],
          },
        ],
      });
    });

    it('Accounts can become verified', async () => {
      const userToValidate = validUser('user-to-validate');
      const emailToken = () => emailServer.requests.POST![0].body.token;
      const { client } = await createAuthorizedClient(userToValidate);
      await expectSuccess(
        client.account(`{
          username
          email
          emailVerified
        }`),
      ).toEqual({
        username: userToValidate.username,
        email: userToValidate.email,
        emailVerified: false,
      });

      await expectSuccess(client.resendVerificationEmail('', { recaptchaResponse })).toBe(true);

      expect(emailServer.requests.POST).toEqual([
        {
          path: '/verification',
          body: {
            emails: [userToValidate.email],
            token: expect.any(String),
          },
          headers: expect.any(Object),
        },
      ]);
      await expectSuccess(
        client.verifyEmailAddress(`{ username emailVerified }`, { validationToken: emailToken() }),
      ).toEqual({
        username: userToValidate.username,
        emailVerified: true,
      });
      return expectSuccess(
        client.account(`{
          username
          email
          emailVerified
        }`),
      ).toEqual({
        username: userToValidate.username,
        email: userToValidate.email,
        emailVerified: true,
      });
    });
  });

  describe('change password', () => {
    const changePassUser = {
      ...validUser('change-pass'),
      password: 'password1',
      wrongPassword: 'not-password1',
      newPassword: 'password2',
      wrongNewPassword: 'not-password2',
    };
    let client: ClientWithoutAxios;

    beforeAll(async () => {
      ({ client } = await createAuthorizedClient(changePassUser));
    });

    it("should fail to change the password when the new passwords don't match", () =>
      expectFailure(
        client.changePassword(`{ authToken }`, {
          oldPassword: changePassUser.password,
          newPassword: changePassUser.newPassword,
          confirmNewPassword: changePassUser.wrongNewPassword,
        }),
      ).toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: 'New passwords do not match',
            path: ['changePassword'],
          },
        ],
      }));

    it('should fail to change the password when a wrong password is used', () =>
      expectFailure(
        client.changePassword(`{ authToken }`, {
          oldPassword: changePassUser.wrongPassword,
          newPassword: changePassUser.newPassword,
          confirmNewPassword: changePassUser.newPassword,
        }),
      ).toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: 'Old password is not correct',
            path: ['changePassword'],
          },
        ],
      }));

    it('should not accept a blank password', () =>
      expectFailure(
        client.changePassword(`{ authToken }`, {
          oldPassword: changePassUser.password,
          newPassword: '',
          confirmNewPassword: '',
        }),
      ).toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: 'New password is not valid, it cannot be empty',
            path: ['changePassword'],
          },
        ],
      }));

    it('should successfully change the password', async () => {
      const { authToken } = await client.changePassword(`{ authToken }`, {
        oldPassword: changePassUser.password,
        newPassword: changePassUser.newPassword,
        confirmNewPassword: changePassUser.newPassword,
      });
      expect(authToken).toBeDefined();

      await expectFailure(
        client.login(`{ authToken }`, {
          usernameEmail: changePassUser.username,
          passwordHash: md5(changePassUser.password),
        }),
      ).toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: 'Bad login credentials',
            path: ['login'],
          },
        ],
      });
      await expectSuccess(
        client.login(`{ authToken }`, {
          usernameEmail: changePassUser.username,
          passwordHash: md5(changePassUser.newPassword),
        }),
      ).toEqual({
        authToken: expect.any(String),
      });
    });
  });

  describe('reset password', () => {
    it('should fail for invalid emails', () => {
      const invalidEmailUser = {
        ...validUser('invalid-email'),
        email: 'asdf',
      };
      const { client } = createClient();
      return expectFailure(
        client.requestPasswordReset('', {
          recaptchaResponse,
          email: invalidEmailUser.email,
        }),
      ).toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: 'Email is not valid',
            path: ['requestPasswordReset'],
          },
        ],
      });
    });

    it('should fail for an invalid recaptcha', () => {
      const user = validUser();
      const { client } = createClient();
      return expectFailure(
        client.requestPasswordReset('', {
          recaptchaResponse: invalidRecaptchaResponse,
          email: user.email,
        }),
      ).toEqual({
        graphql: true,
        status: 200,
        errors: [
          {
            message: 'Recaptcha validation failed',
            path: ['requestPasswordReset'],
          },
        ],
      });
    });

    describe('unregistered users', () => {
      const unregisteredUser = validUser('unregistered');
      const { client } = createClient();

      it('should not throw an error when the email is not registered to a user', () =>
        expectSuccess(
          client.requestPasswordReset('', {
            recaptchaResponse,
            email: unregisteredUser.email,
          }),
        ).toEqual(true));

      it('should not send the reset email to an email not registered to a user', async () => {
        await client.requestPasswordReset('', {
          recaptchaResponse,
          email: unregisteredUser.email,
        });
        expect(emailServer.requests.POST).toBeUndefined();
      });
    });

    describe('registered users', () => {
      it('should send the email to a registered user', async () => {
        const registeredUser = validUser('registered');
        await createAuthorizedClient(registeredUser);
        const { client } = createClient();

        await expectSuccess(
          client.requestPasswordReset('', {
            recaptchaResponse,
            email: registeredUser.email,
          }),
        ).toEqual(true);
        expect(emailServer.requests.POST).toEqual([
          {
            path: '/reset-password',
            body: {
              emails: [registeredUser.email],
              token: expect.any(String),
            },
            headers: expect.objectContaining({
              authorization: 'Secret some-email-secret',
            }),
          },
        ]);
      });

      it("should fail when the new passwords don't match", async () => {
        const registeredUser = validUser('registered');
        await createAuthorizedClient(registeredUser);
        const { client } = createClient();

        await client.requestPasswordReset('', {
          recaptchaResponse,
          email: registeredUser.email,
        });
        const { token } = emailServer.requests.POST![0].body;

        await expectFailure(
          client.resetPassword(`{ authToken }`, {
            newPassword: 'new-pass',
            confirmNewPassword: 'not-new-pass',
            passwordResetToken: token,
          }),
        ).toEqual({
          graphql: true,
          status: 200,
          errors: [
            {
              message: "New passwords don't match",
              path: ['resetPassword'],
            },
          ],
        });
      });

      it('should reset the password using the token from the email', async () => {
        const registeredUser = validUser('registered');
        await createAuthorizedClient(registeredUser);
        const { client } = createClient();

        await client.requestPasswordReset('', {
          recaptchaResponse,
          email: registeredUser.email,
        });
        const { token } = emailServer.requests.POST![0].body;

        await expectSuccess(
          client.resetPassword(`{ authToken }`, {
            newPassword: 'new-pass',
            confirmNewPassword: 'new-pass',
            passwordResetToken: token,
          }),
        ).toEqual({ authToken: expect.any(String) });
      });

      it('should allow logging in with new password', async () => {
        const registeredUser = validUser('registered');
        await createAuthorizedClient(registeredUser);
        const { axios, client } = createClient();
        const newPassword = 'new-pass';

        await client.requestPasswordReset('', {
          recaptchaResponse,
          email: registeredUser.email,
        });
        const { token } = emailServer.requests.POST![0].body;
        const { authToken } = await client.resetPassword(`{ authToken }`, {
          newPassword,
          confirmNewPassword: newPassword,
          passwordResetToken: token,
        });

        authorizeClient(axios, authToken);
        expectSuccess(client.account('{ username }')).toEqual({
          username: registeredUser.username,
        });
      });
    });
  });
});
