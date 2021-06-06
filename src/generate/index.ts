import { parseSchema } from './schema';
import path from 'path';

async function tryCatch(executor: () => Promise<void>): Promise<void> {
  try {
    console.log();
    await executor();
  } catch (err) {
    console.error('Failed');
    console.error(err);
  }
}

tryCatch(async () => {
  const schema = await parseSchema('https://test.api.anime-skip.com/graphql');
  const output = path.resolve(__dirname, '../index.ts');
  schema.generate(output);
});
