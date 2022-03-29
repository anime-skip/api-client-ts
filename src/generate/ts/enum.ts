import CodeBlockWriter from 'code-block-writer';
import { EnumType } from '../types';
import { writeComment } from './comment';

export function writeEnum(w: CodeBlockWriter, enum_: EnumType): void {
  writeComment(w, enum_);
  w.write(`export enum Gql${enum_.name}`).block(() => {
    enum_.enumValues.forEach(e => {
      writeComment(w, e);
      w.writeLine(`${e.name} = '${e.name}',`);
    });
  });
  w.newLineIfLastNot();
}
