import chance from 'chance';

const c = chance();

export function validUser(
  username?: string,
  email?: string,
  password?: string,
): {
  username: string;
  password: string;
  email: string;
} {
  const hash = c.hash({ length: 8 });
  return {
    username: (username ? username : 'user') + '-' + hash,
    email: email ? email.replace('@', `-${hash}@`) : c.email({ domain: 'anime-skip.com' }),
    password: password ?? `pass${hash}`,
  };
}
