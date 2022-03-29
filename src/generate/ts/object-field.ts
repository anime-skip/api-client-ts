import CodeBlockWriter from 'code-block-writer';

export function writeObjectField(w: CodeBlockWriter, field: { key: string; value?: string }): void {
  w.write(field.key);
  w.conditionalWrite(field.value != null, () => `: ${field.value}`);
  w.writeLine(',');
}
