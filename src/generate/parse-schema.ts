import { IntrospectedSchema, ParsedSchema, RootResolverType } from './types';

const SKIPPED_OBJECT_TYPES = ['Query', 'Mutation', 'Subscription'];

export function parseSchema(schema: IntrospectedSchema): ParsedSchema {
  const out: ParsedSchema = {
    types: [],
    enums: [],
    scalars: [],
    queries: [],
    mutations: [],
    subscriptions: [],
  };

  schema.types.forEach(t => {
    if ('name' in t && SKIPPED_OBJECT_TYPES.includes(t.name)) return;

    switch (t.kind) {
      case 'OBJECT':
      case 'INPUT_OBJECT':
      case 'INTERFACE':
        out.types.push(t);
        break;
      case 'ENUM':
        out.enums.push(t);
        break;
      case 'SCALAR':
        out.scalars.push(t);
        break;
      default:
        console.warn('Unknown type:', t);
    }
  });

  schema.types.forEach(t => {
    if (t.kind !== 'OBJECT' || !SKIPPED_OBJECT_TYPES.includes(t.name)) return;

    switch (t.name) {
      case 'Query':
        out.queries.push(t as unknown as RootResolverType);
        break;
      case 'Mutation':
        out.mutations.push(t as unknown as RootResolverType);
        break;
      case 'Subscription':
        out.subscriptions.push(t as unknown as RootResolverType);
        break;
    }
  });

  return out;
}
