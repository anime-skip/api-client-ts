import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestHistory {
  path: string;
  body: any;
  headers: Record<string, string | string[] | undefined>;
}

export interface MockApi {
  requests: Record<Methods | string, RequestHistory[] | undefined>;
  mock(): void;
  clear(): void;
  // reset(): void;
  stop(): void;
}

export async function mockApi(port: number): Promise<MockApi> {
  return new Promise(res => {
    const app = new Koa();
    app.use(bodyParser());

    const mocks: MockApi = {
      requests: {},
      mock() {
        return;
      },
      clear() {
        this.requests = {};
      },
      stop() {
        server.close();
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
