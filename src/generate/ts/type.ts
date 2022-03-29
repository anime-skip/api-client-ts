import { Type } from '../types';

export function getType(type: Type, nonNull = false): string {
  if (type.kind === 'LIST') return `Array<${getType(type.ofType)}>`;
  if (type.kind === 'NON_NULL') return getType(type.ofType, true);
  if (type.kind === 'HARD_CODED') return type.value;

  const name = `Gql${type.name}`;
  if (nonNull) return name;
  return `${name} | undefined`;
}
