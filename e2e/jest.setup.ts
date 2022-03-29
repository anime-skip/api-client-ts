import { createStatelessClient } from './utils/clients';
import { clearMockApis, setupMockApis, stopMockApis } from './utils/mock-apis';

beforeAll(setupMockApis);
beforeEach(clearMockApis);
afterAll(stopMockApis);

test('Health check', async () => {
  const client = createStatelessClient();
  const response = await client.healthCheck();
  expect(response).toMatchObject({ status: 'RUNNING' });
});
