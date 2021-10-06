import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { log } from './log';

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
    log(`Starting ${name} mock...`);
    const app = new Koa();
    app.use(bodyParser());

    const mocks: MockApi = {
      requests: {},
      clear() {
        this.requests = {};
      },
      async stop() {
        log(`Stopping ${name}...`);
        return new Promise((res, rej) => {
          server.close(err => {
            if (err) {
              log(`Stopped ${name} with error: ${err.message}`);
              rej(err);
            } else {
              log(`Stopped ${name}!`);
              res();
            }
          });
        });
      },
    };
    app.use(ctx => {
      if (mocks.requests[ctx.method] == null) mocks.requests[ctx.method] = [];
      mocks.requests[ctx.method]?.push({
        path: ctx.path,
        body: ctx.request.body,
        headers: ctx.headers,
      });
      ctx.status = 200;
    });

    const server = app.listen(port, () => {
      res(mocks);
    });
  });
}
