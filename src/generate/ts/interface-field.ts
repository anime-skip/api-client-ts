import CodeBlockWriter from 'code-block-writer';
import { Field } from '../types';
import { writeComment } from './comment';
import { getMethodArg } from './method-arg';

export function writeInterfaceField(w: CodeBlockWriter, field: Field): void {
  writeComment(w, field);
  w.writeLine(getMethodArg(field));
}
