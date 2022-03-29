import { mockApi, MockApi } from '../utils/mock-api';
import { println } from './log';

let allMocks: MockApi[] = [];
export let emailServer: MockApi;

export async function setupMockApis(): Promise<void> {
  println('Starting Mock APIs:');
  emailServer = await mockApi('email', 9100);

  allMocks = [emailServer];

  println();
}

export function clearMockApis(): void {
  println('Clearing all mocks:');
  allMocks.forEach(mock => mock.clear());

  println();
}

export async function stopMockApis(): Promise<void> {
  println('Stopping all mocks:');
  for (const mock of allMocks) {
    await mock.stop();
  }

  println();
}
