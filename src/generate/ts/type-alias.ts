import CodeBlockWriter from 'code-block-writer';
import { ScalarType } from '../types';
import { GQL_TO_TS_PRIMITIVES } from '../utils/type-mapping';
import { writeComment } from './comment';

export function writeTypeAlias(w: CodeBlockWriter, scalar: ScalarType): void {
  writeComment(w, scalar);
  const type = GQL_TO_TS_PRIMITIVES[scalar.name] ?? `unknown /* ${scalar.name} */`;
  w.writeLine(`export type Gql${scalar.name} = ${type}`);
}
