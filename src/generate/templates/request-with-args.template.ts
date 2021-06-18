// KEYS:
// - REQUEST_NAME
// - REQUEST_NAME_CAPITALIZED
// - TYPE
// - RETURN_TYPE
// - VARIABLE_DECLARATIONS
// - VARIABLE_PASSED
// - VARIABLE_JSON
// VARS:
import { AxiosInstance, AxiosResponse } from 'axios';
type $RETURN_TYPE$ = any;
let axios: AxiosInstance;
const $VARIABLE_JSON$ = '';
type GqlResponse<K, T> = AxiosResponse<{ data?: { "$REQUEST_NAME$": T }, errors?: any }>
let clientId: string;
// TEMPLATE:
    async $REQUEST_NAME$<T extends Partial<$RETURN_TYPE$>>(
      graphql: string,
      args: Gql$REQUEST_NAME_CAPITALIZED$Args
    ): Promise<T> {
      try {
        const response: GqlResponse<"$REQUEST_NAME$", T> = await axios.post("/graphql", {
        query: `
$TYPE$ $REQUEST_NAME_CAPITALIZED$(
  $VARIABLE_DECLARATIONS$
) {
  $REQUEST_NAME$(
    $VARIABLE_PASSED$
  ) ${graphql}
}
          `,
          operationName: "$REQUEST_NAME_CAPITALIZED$",
          variables: {
            $VARIABLE_JSON$
          }
        }, {
          headers: {
            'X-Client-ID': clientId
          }
        });
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors)
        }
        return response.data.data["$REQUEST_NAME$"]
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors)
        }
        throw err;
      }
    }
