import { parseSchema } from './schema';
import path from 'path';

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
  const schema = await parseSchema(
    `${process.env.BASE_API_URL || 'http://test.api.anime-skip.com'}/graphql`,
  );
  const output = path.resolve(__dirname, '../index.ts');
  schema.generate(output);
});
