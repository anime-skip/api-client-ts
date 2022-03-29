import CodeBlockWriter from 'code-block-writer';
import { ResolverMethod, RootResolverType } from '../types';
import { capitalize } from '../utils/text';
import { getType } from './type';
import { createGraphqlWriter } from './writer';

export function getQuery(resolver: RootResolverType, method: ResolverMethod): string {
  const w = createGraphqlWriter();
  writeQuery(w, resolver, method);
  return `\`${w.toString()}\``;
}

function writeQuery(w: CodeBlockWriter, resolver: RootResolverType, method: ResolverMethod): void {
  const queryType = resolver.name.toLowerCase();
  const operationName = capitalize(method.name);
  const hasArgs = method.args.length > 0;
  if (hasArgs) {
    w.write(`${queryType} ${operationName}(`)
      .indent(() => {
        method.args.forEach(arg => w.writeLine(`$${arg.name}: ${getType(arg.type)},`));
      })
      .write(')');
  } else {
    w.write(`${queryType} ${operationName}`);
  }
  w.block(() => {
    if (hasArgs) {
      w.write(`${method.name}(`)
        .indent(() => {
          method.args.forEach(arg => w.writeLine(`${arg.name}: $${arg.name},`));
        })
        .write(')');
    } else {
      w.write(method.name);
    }
    w.write(' ${query}');
  });
}
