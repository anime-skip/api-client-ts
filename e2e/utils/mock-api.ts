import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { println } from './log';

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestHistory {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
  headers: Record<string, string | string[] | undefined>;
}

export interface MockApi {
  requests: Record<Methods | string, RequestHistory[] | undefined>;
  clear(): void;
  // reset(): void;
  stop(): Promise<void>;
}

export async function mockApi(name: string, port: number): Promise<MockApi> {
  return new Promise(res => {
    println(` - ${name}`);

    const mock: MockApi = {
      requests: {},
      clear() {
        println(` - ${name}`);
        this.requests = {};
      },
      async stop() {
        println(` - ${name}`);
        return new Promise((res, rej) => {
          server.close(err => {
            if (err) {
              println(`   Error: ${err.message}`);
              rej(err);
            } else {
              res();
            }
          });
        });
      },
    };

    const app = new Koa();
    app.use(bodyParser());
    app.use(async (ctx, next) => {
      println(`<<< [${name}] ${ctx.method} ${ctx.path}`);
      println(ctx.request.body);
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      println(`>>> [${name}] status=${ctx.status} (${ms}ms)`);
    });
    app.use(async ctx => {
      const info = {
        path: ctx.path,
        body: ctx.request.body,
        headers: ctx.headers,
      };
      mock.requests[ctx.method] ??= [];
      mock.requests[ctx.method]?.push(info);
      ctx.status = 200;
    });

    const server = app.listen(port, () => {
      res(mock);
    });
  });
}
