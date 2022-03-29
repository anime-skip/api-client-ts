import CodeBlockWriter from 'code-block-writer';
import { getQuery } from '../graphql/query';
import { Argument, ResolverMethod, RootResolverType } from '../types';
import { capitalize } from '../utils/text';
import { writeComment } from './comment';
import { writeMethod } from './method';
import { getMethodArg } from './method-arg';
import { getSafeName } from './safe-name';
import { getType } from './type';

export function writeResolverMethods(w: CodeBlockWriter, resolver: RootResolverType): void {
  resolver.fields.forEach(method => writeResolverMethod(w, resolver, method));
}

function writeResolverMethod(
  w: CodeBlockWriter,
  resolver: RootResolverType,
  method: ResolverMethod,
): void {
  const queryArg: Argument = {
    name: 'query',
    type: {
      kind: 'HARD_CODED',
      value: 'string',
    },
    description: 'Custom fetch overrides',
  };
  const configArg: Argument = {
    name: 'config',
    optional: true,
    type: {
      kind: 'HARD_CODED',
      value: 'RequestInit',
    },
    description: 'Custom fetch overrides',
  };
  const variableArgs: Argument = {
    name: 'variables',
    optional: true,
    type: {
      kind: 'HARD_CODED',
      value: `{ ${method.args.map(arg => getMethodArg(arg)).join(';')} }`,
    },
    description: 'Custom fetch overrides',
  };
  const operationName = capitalize(method.name);

  let args: Argument[];
  const hasVariables = method.args.length > 0;
  if (hasVariables) {
    args = [queryArg, variableArgs, configArg];
  } else {
    args = [queryArg, configArg];
  }

  writeComment(w, method);
  writeMethod(w, {
    isAsync: true,
    name: method.name,
    args,
    returnType: method.type,
    block() {
      w.write(`const res = await fetch(`)
        .indent(() => {
          w.writeLine('baseUrl + "/graphql",');
          w.block(() => {
            w.writeLine('...config,'),
              w.writeLine("method: 'POST',"),
              w
                .write('body: JSON.stringify(')
                .block(() => {
                  w.writeLine(`query: ${getQuery(resolver, method)},`);
                  w.conditionalWriteLine(hasVariables, () => 'variables,');
                  w.writeLine(`operationName: '${operationName}',`);
                })
                .writeLine('),');
            w.write(`headers:`)
              .block(() => {
                w.writeLine('...config?.headers,');
                w.writeLine("'X-Client-ID': clientId,");
                w.writeLine("'Content-Type': 'application/json',");
              })
              .writeLine(',');
          });
        })
        .writeLine(')');

      w.writeLine(
        `const { data, errors } = (await res.json()) as GqlResponse<'${method.name}', ${getType(
          method.type,
        )}>`,
      );
      w.writeLine('if (errors != null) throw new GqlError(res.status, errors)');
      w.writeLine(`return data["${method.name}"]`);
    },
  });
}
