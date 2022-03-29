import CodeBlockWriter from 'code-block-writer';

export function createGraphqlWriter(): CodeBlockWriter {
  return new CodeBlockWriter({
    indentNumberOfSpaces: 2,
  });
}
