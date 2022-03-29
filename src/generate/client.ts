import { IntrospectedSchema } from './types';
import { promises as fs } from 'fs';
import CodeBlockWriter from 'code-block-writer';
import { writeStatelessModule } from './ts/stateless-module';
import { parseSchema } from './parse-schema';
import { createTsWriter } from './ts/writer';

export async function generateClient(
  schema: IntrospectedSchema,
  outputPath: string,
): Promise<void> {
  const parsedSchema = parseSchema(schema);
  const w = createTsWriter();
  writeStatelessModule(w, parsedSchema);
  writeToFile(w, outputPath);
}

async function writeToFile(w: CodeBlockWriter, outputPath: string) {
  w.newLineIfLastNot();
  fs.writeFile(outputPath, w.toString());
}
