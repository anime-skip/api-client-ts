import CodeBlockWriter from 'code-block-writer';
import { writeMethod } from './method';

export function writeHealthCheck(w: CodeBlockWriter): void {
  writeMethod(w, {
    isAsync: true,
    name: 'healthCheck',
    returnType: { kind: 'HARD_CODED', value: 'ApiHealth' },
    block() {
      w.writeLine(
        "const res = await fetch(baseUrl + '/status', { headers: { 'X-Client-ID': clientId } })",
      );
      w.writeLine('const payload = await res.json()');
      w.writeLine('const { errors } = payload');
      w.writeLine('if (errors != null) throw new GqlError(res.status, errors)');
      w.writeLine('return payload');
    },
  });
}
