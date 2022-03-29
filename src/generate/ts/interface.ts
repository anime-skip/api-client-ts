import CodeBlockWriter from 'code-block-writer';
import { Field, InputObjectType, InterfaceType, ObjectType } from '../types';
import { writeComment } from './comment';
import { writeInterfaceField } from './interface-field';

export function writeInterface(
  w: CodeBlockWriter,
  object: ObjectType | InputObjectType | InterfaceType,
): void {
  writeComment(w, object);
  w.write(`export interface Gql${object.name}`).block(() => {
    getFields(object).forEach(f => writeInterfaceField(w, f));
  });
  w.newLineIfLastNot();
}

function getFields(object: ObjectType | InputObjectType | InterfaceType): Field[] {
  if (object.kind === 'INPUT_OBJECT') return object.inputFields;
  return object.fields;
}
