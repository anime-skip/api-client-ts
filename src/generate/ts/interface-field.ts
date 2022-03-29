import CodeBlockWriter from 'code-block-writer';
import { Field } from '../types';
import { getMethodArg } from './method-arg';

export function writeInterfaceField(w: CodeBlockWriter, field: Field): void {
  w.writeLine(getMethodArg(field));
}
