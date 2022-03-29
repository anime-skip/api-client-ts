import CodeBlockWriter from 'code-block-writer';
import { Argument, Type } from '../types';
import { writeMethodDeclaration } from './method-declaration';

export function writeMethod(
  w: CodeBlockWriter,
  {
    isAsync,
    name,
    args,
    returnType,
    block,
  }: { isAsync?: boolean; name: string; args?: Argument[]; returnType?: Type; block(): void },
): void {
  writeMethodDeclaration(w, { isAsync, name, args, returnType });
  w.write(' ');
  w.inlineBlock(block);
}
