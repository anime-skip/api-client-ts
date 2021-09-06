import { IntrospectionType } from './types';

export function mapGqlType(type: IntrospectionType): { type: string; nullable: boolean } {
  if (
    type.kind === 'SCALAR' ||
    type.kind === 'OBJECT' ||
    type.kind === 'INPUT_OBJECT' ||
    type.kind === 'ENUM'
  ) {
    if (type.name == null) {
      throw Error('Some type.name was null');
    }
    return {
      type: type.name,
      nullable: true,
    };
  }
  if (type.ofType == null) {
    throw Error(`type.ofType was null when it shouldn't be: ${JSON.stringify(type, null, 2)}`);
  }
  if (type.kind == 'NON_NULL') {
    if (type.ofType == null) {
      throw Error('Non-null type missing what it is non-null of');
    }
    const { type: t } = mapGqlType(type.ofType);
    return { type: t + '!', nullable: false };
  }
  if (type.kind == 'LIST') {
    const { type: t } = mapGqlType(type.ofType);
    return {
      type: `[${t}]`,
      nullable: true,
    };
  }
  throw Error(`Unknown kind: ${type.kind}`);
}
