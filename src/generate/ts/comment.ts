import CodeBlockWriter from 'code-block-writer';
import { Deprecation } from '../types';

export function writeComment(
  w: CodeBlockWriter,
  { description, isDeprecated, deprecationReason }: { description?: string } & Partial<Deprecation>,
): void {
  if (description?.trim() || isDeprecated) {
    const lines = description?.trim().split('\n') ?? [];
    if (isDeprecated) lines.push(`@deprecated ${deprecationReason}`);

    w.writeLine('/**');
    lines.forEach(l => w.writeLine(` * ${l}`));
    w.writeLine(' */');
  }
}
