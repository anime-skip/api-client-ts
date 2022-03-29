/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import md5 from 'md5';
import * as AnimeSkip from '../../src';
import { emailServer } from './mock-apis';
import fetch from 'node-fetch';

export const endpoint = 'http://backend:8080';
export const clientId = 'ZGfO0sMF3eCwLYf8yMSCJjlynwNGRXWE';
export const recaptchaResponse = 'mock-recaptcha-response';

const CONFIG: AnimeSkip.Config = {
  baseUrl: endpoint,
  clientId,
  // @ts-expect-error: fetch type mismatch, should be fine
  fetch,
  storage: AnimeSkip.createInMemoryStorage(),
};

export function createStatelessClient() {
  return AnimeSkip.createStatelessClient(CONFIG);
}

// export function authorizeClient(client: AnimeSkip.StatelessClient, accessToken: string): AnimeSkip.Client {
//   return new Proxy(client, {
//     get(target, k) {
//       const key = k as keyof AnimeSkipClient;
//       if (Object.keys(target).includes(key)) {
//         const maxArgs = target[key].length;
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         return (...passedArgs: any[]) => {
//           const configIndex = maxArgs - 1;
//           const existingConfig = passedArgs[configIndex] as RequestInit | undefined;
//           const newConfig: RequestInit = {
//             ...existingConfig,
//             headers: {
//               ...existingConfig?.headers,
//               Authorization: `Bearer ${accessToken}`,
//             },
//           };
//           const argsWithAuth = [...passedArgs];
//           argsWithAuth[configIndex] = newConfig;
//           // @ts-expect-error: crazy arg manipulation going on here lol
//           return target[key](...argsWithAuth);
//         };
//       } else {
//         // @ts-expect-error: target
//         return target[k];
//       }
//     },
//   });
// }

export async function createClient(user: {
  username: string;
  password: string;
  email: string;
}): Promise<AnimeSkip.Client> {
  const client = AnimeSkip.createClient(CONFIG);
  await client.createAccount({
    username: user.username,
    email: user.email,
    passwordHash: md5(user.password),
    recaptchaResponse,
  });
  emailServer.clear();
  return client;
}
