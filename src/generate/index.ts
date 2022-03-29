import path from 'path';
import { generateClient } from './client';
import { introspect } from './introspection';

async function tryCatch(executor: () => Promise<void>): Promise<void> {
  try {
    console.log();
    await executor();
  } catch (err) {
    console.error('Failed');
    console.error(err);
    process.exit(1);
  }
}

tryCatch(async () => {
  const url = process.env.BASE_API_URL || 'http://test.api.anime-skip.com';
  const schema = await introspect(`${url}/graphql`);
  const output = path.resolve(__dirname, '../stateless.ts');
  generateClient(schema, output);
});
