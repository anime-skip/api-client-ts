import { mockApi, MockApi } from '../utils/mock-api';
import { log } from './log';

let allMocks: MockApi[] = [];
export let emailServer: MockApi;

export async function setupMockApis(): Promise<void> {
  emailServer = await mockApi('email', 9100);

  allMocks = [emailServer];
}

export function clearMockApis(): void {
  log('Clearing all mocks:');
  allMocks.forEach(mock => mock.clear());
  log('Done!');
}

export async function stopMockApis(): Promise<void> {
  for (const mock of allMocks) {
    await mock.stop();
  }
}
