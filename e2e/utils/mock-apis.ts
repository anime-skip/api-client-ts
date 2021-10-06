import { mockApi, MockApi } from '../utils/mock-api';

let allMocks: MockApi[] = [];
export let emailServer: MockApi;

export async function setupMockApis(): Promise<void> {
  emailServer = await mockApi('email', 9100);

  allMocks = [emailServer];
}

export function clearMockApis(): void {
  allMocks.forEach(mock => mock.clear());
}

export async function stopMockApis(): Promise<void> {
  for (const mock of allMocks) {
    await mock.stop();
  }
}
