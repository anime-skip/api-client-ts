import { AxiosInstance, AxiosResponse } from 'axios';

export async function healthCheck(axios: AxiosInstance, clientId: string): Promise<AxiosResponse> {
  const response = await axios.get('/status', {
    headers: {
      'X-Client-ID': clientId,
    },
  });
  return response;
}
