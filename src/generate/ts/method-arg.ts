import { Argument } from '../types';
import { getSafeName } from './safe-name';
import { getType } from './type';

export function getMethodArg(arg: Argument): string {
  const type = getType(arg.type);
  const isOptional = arg.optional || type.endsWith(' | undefined');
  return `${getSafeName(arg.name)}${isOptional ? '?' : ''}: ${type}`;
}
