import { IntrospectionType } from './types';

const knownTypes: Record<string, string> = {
  Int: 'number',
  Float: 'number',
  String: 'string',
  Boolean: 'boolean',
  Time: 'string'
};

export function mapType(type: IntrospectionType): { type: string; nullable: boolean } {
  if (
    type.kind === 'SCALAR' ||
    type.kind === 'OBJECT' ||
    type.kind === 'INPUT_OBJECT' ||
    type.kind === 'ENUM'
  ) {
    if (type.name == null) {
      console.warn('Some type.name was null');
      return {
        type: 'unknown',
        nullable: true
      };
    }
    return {
      type: 'Gql' + type.name,
      nullable: true
    };
  }
  if (type.ofType == null) {
    throw Error(`type.ofType was null when it shouldn't be: ${JSON.stringify(type, null, 2)}`);
  }
  if (type.kind == 'NON_NULL') {
    if (type.ofType == null) {
      console.warn('Non-null type missing what it is non-null of');
      return {
        type: 'unknown',
        nullable: true
      };
    }
    const { type: t } = mapType(type.ofType);
    return { type: t, nullable: false };
  }
  if (type.kind == 'LIST') {
    const { type: t, nullable } = mapType(type.ofType);
    return {
      type: `Array<${t + (nullable ? ' | null' : '')}>`,
      nullable: true
    };
  }
  throw Error(`Unknown kind: ${type.kind}`);
}
