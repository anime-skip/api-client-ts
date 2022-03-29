import { Fetch } from './fetch';
import { AsyncStorage } from './storage';

export type GqlResponse<K extends string, T> = {
  data: { [requestName in K]: T };
  errors?: GqlResponseError[];
};

export type GqlResponseError = {
  message: string;
  path?: string | string[];
  locations: Array<{
    line: number;
    column: number;
  }>;
} & Record<string, unknown>;

export class GqlError {
  readonly graphql = true;

  constructor(readonly status: number, readonly errors: GqlResponse<any, any>['data']['errors']) {}

  get message(): string {
    return `Graphql request failed with status ${this.status} (${JSON.stringify(
      this.errors,
      null,
      2,
    )})`;
  }
}

export interface StatelessConfig {
  baseUrl: string;
  clientId: string;
  fetch?: Fetch;
}

export interface Config extends StatelessConfig {
  /**
   * Where to store the tokens and user details. Defaults to localStorage
   */
  storage?: AsyncStorage;
}

export interface ApiHealth {
  introspection: boolean;
  playground: boolean;
  status: 'RUNNING';
  version: string;
}
