import Axios, { AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { IntrospectedSchema } from './types';

type IntrospectionResponse = AxiosResponse<{ data: { __schema: IntrospectedSchema } }>;

export async function introspect(url: string): Promise<IntrospectedSchema> {
  console.log('Loading schema...');

  const introspectionClient = Axios.create({
    headers: { 'X-Client-ID': 'ZGfO0sMF3eCwLYf8yMSCJjlynwNGRXWE' },
  });
  axiosRetry(introspectionClient, { retries: 5, retryDelay: () => 5000 });

  return (
    await introspectionClient.post<unknown, IntrospectionResponse>(url, {
      query: `query IntrospectionQuery {
            __schema {
              queryType {
                name
              }
              mutationType {
                name
              }
              subscriptionType {
                name
              }
              types {
                ...FullType
              }
              directives {
                name
                description
                locations
                args {
                  ...InputValue
                }
              }
            }
          }
          
          fragment FullType on __Type {
            kind
            name
            description
            fields(includeDeprecated: true) {
              name
              description
              args {
                ...InputValue
              }
              type {
                ...TypeRef
              }
              isDeprecated
              deprecationReason
            }
            inputFields {
              ...InputValue
            }
            interfaces {
              ...TypeRef
            }
            enumValues(includeDeprecated: true) {
              name
              description
              isDeprecated
              deprecationReason
            }
            possibleTypes {
              ...TypeRef
            }
          }
          
          fragment InputValue on __InputValue {
            name
            description
            type {
              ...TypeRef
            }
            defaultValue
          }
          
          fragment TypeRef on __Type {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                        ofType {
                          kind
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }`,
      operationName: 'IntrospectionQuery',
    })
  ).data.data.__schema;
}
