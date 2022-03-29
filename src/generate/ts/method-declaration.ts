import CodeBlockWriter from 'code-block-writer';
import { Argument, Type } from '../types';
import { getMethodArg } from './method-arg';
import { getType } from './type';

export function writeMethodDeclaration(
  w: CodeBlockWriter,
  {
    isAsync,
    name,
    args,
    returnType,
  }: { isAsync?: boolean; name: string; args?: Argument[]; returnType?: Type },
): void {
  const argString = args?.map(getMethodArg).join(', ') ?? '';
  w.conditionalWrite(isAsync, () => 'async ');
  w.write(`function ${name}(${argString})`);
  w.conditionalWrite(!!returnType, () => {
    if (isAsync) return `: Promise<${getType(returnType!)}>`;
    else return `: ${getType(returnType!)}`;
  });
}
