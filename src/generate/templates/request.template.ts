// KEYS:
// - REQUEST_NAME
// - REQUEST_NAME_CAPITALIZED
// - TYPE
// - RETURN_TYPE
// VARS:
import { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
type $RETURN_TYPE$ = any;
let axios: AxiosInstance;
type GqlResponse<K, T> = AxiosResponse<{ data?: { "$REQUEST_NAME$": T }, errors?: any }>
// TEMPLATE:
    async $REQUEST_NAME$<T extends Partial<$RETURN_TYPE$>>(graphql: string, axiosConfig?: AxiosRequestConfig): Promise<T> {
      try {
        const response: GqlResponse<"$REQUEST_NAME$", T> = await axios.post("/graphql", {
        query: `
$TYPE$ $REQUEST_NAME_CAPITALIZED$ {
  $REQUEST_NAME$ ${graphql}
}
          `,
          operationName: "$REQUEST_NAME_CAPITALIZED$",
        }, {
          ...axiosConfig,
          headers: {
            ...axiosConfig?.headers,
            'X-Client-ID': clientId
          }
        });
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors)
        }
        return response.data.data["$REQUEST_NAME$"]
      } catch (err) {
        if (err.resposne != null) {
          throw new GqlError(err.response.status, err.response.data.errors)
        }
        throw err;
      }
    }
