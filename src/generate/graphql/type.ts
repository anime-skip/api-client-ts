import { Type } from '../types';

export function getType(type: Type): string {
  if (type.kind === 'LIST') return `[${getType(type.ofType)}]`;
  if (type.kind === 'NON_NULL') return `${getType(type.ofType)}!`;
  if (type.kind === 'HARD_CODED') throw Error('MANUAL types not supported inside graphql queries');
  return type.name;
}
