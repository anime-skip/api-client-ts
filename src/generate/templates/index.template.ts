// KEYS:
// - NAME
// - QUERIES
// - MUTATIONS
// - SUBSCRIPTIONS
// - TYPES
// VARS:
const $TYPES$ = '';
const $QUERIES$ = {};
const $MUTATIONS$ = {};
const $SUBSCRIPTIONS$ = {};
const queries = {};
const mutations = {};
const subscriptions = {};
// TEMPLATE:
import Axios, { AxiosResponse } from 'axios';

export type GqlResponse<K extends string, T> = AxiosResponse<{
  data: { [requestName in K]: T };
  errors?: Array<
    {
      message: string;
      path?: string | string[];
      locations: Array<{
        line: number;
        column: number;
      }>
    } & Record<string, unknown>
  >;
}>

export class GqlError {
  readonly graphql = true;

  constructor(readonly status: number, readonly errors: GqlResponse<any, any>["data"]["errors"]) {}
  
  get message(): string {
    return `Graphql request failed with status ${this.status} (${JSON.stringify(this.errors, null, 2)})`
  }
}

$TYPES$;

export default function create$NAME$Client(baseUrl: string, clientId: string) {
  const axios = Axios.create({
    baseURL: baseUrl
  });

  // Initialize queries
$QUERIES$;

  // Initialize mutations
$MUTATIONS$;

  // Initialize subscriptions
$SUBSCRIPTIONS$;

  return {
    ...queries,
    ...mutations,
    ...subscriptions,
    axios
  };
}
