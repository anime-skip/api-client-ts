import CodeBlockWriter from 'code-block-writer';
import { InputObjectType, InterfaceType, ObjectType } from '../types';
import { writeComment } from './comment';
import { writeInterfaceField } from './interface-field';

export function writeInterface(
  w: CodeBlockWriter,
  object: ObjectType | InputObjectType | InterfaceType,
): void {
  writeComment(w, object);
  w.write(`export interface Gql${object.name}`).block(() => {
    object.fields.forEach(f => writeInterfaceField(w, f));
  });
  w.newLineIfLastNot();
}
