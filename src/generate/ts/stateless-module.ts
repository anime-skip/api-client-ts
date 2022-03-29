import CodeBlockWriter from 'code-block-writer';
import { HardCodedType, ParsedSchema } from '../types';
import { writeEnum } from './enum';
import { writeHealthCheck } from './health-check';
import { writeInterface } from './interface';
import { writeMethod } from './method';
import { writeObjectField } from './object-field';
import { writeResolverMethods } from './resolver-methods';
import { writeTypeAlias } from './type-alias';

export function writeStatelessModule(w: CodeBlockWriter, schema: ParsedSchema): void {
  w.writeLine("import { GqlResponse, GqlError, StatelessConfig, ApiHealth } from './types'");
  w.writeLine("import { DEFAULT_FETCH } from './fetch'");
  w.newLine();

  for (const scalar of schema.scalars) {
    writeTypeAlias(w, scalar);
    w.newLine();
  }

  for (const enum_ of schema.enums) {
    writeEnum(w, enum_);
    w.newLine();
  }

  for (const type of schema.types) {
    writeInterface(w, type);
    w.newLine();
  }

  w.writeLine('export type StatelessClient = ReturnType<typeof createStatelessClient>');
  w.newLine();

  const configType: HardCodedType = {
    kind: 'HARD_CODED',
    value: 'StatelessConfig',
  };
  w.write('export ');
  writeMethod(w, {
    name: 'createStatelessClient',
    args: [{ name: '{ baseUrl, clientId, fetch = DEFAULT_FETCH }', type: configType }],
    block() {
      w.writeLine(
        'if (fetch == null) throw Error(`fetch was ${fetch}. Did you forget to provide config.fetch?`)',
      );
      w.newLine();

      schema.queries.forEach(q => writeResolverMethods(w, q));
      w.newLine();

      schema.mutations.forEach(m => writeResolverMethods(w, m));
      w.newLine();

      schema.subscriptions.forEach(s => writeResolverMethods(w, s));
      w.newLine();

      writeHealthCheck(w);

      w.write('return').block(() => {
        schema.queries.forEach(r =>
          r.fields.forEach(method => writeObjectField(w, { key: method.name })),
        );
        schema.mutations.forEach(r =>
          r.fields.forEach(method => writeObjectField(w, { key: method.name })),
        );
        schema.subscriptions.forEach(r =>
          r.fields.forEach(method => writeObjectField(w, { key: method.name })),
        );
        writeObjectField(w, { key: 'healthCheck' });
      });
    },
  });
}
