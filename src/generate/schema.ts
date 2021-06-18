import Axios from 'axios';
import { IntrospectionSchema, IntrospectionFullType } from './types';
import { loadTemplate } from './load-template';
import { mapType } from './map-type';
import { capitalize } from './capitalize';
import fs from 'fs';

async function introspection(url: string): Promise<IntrospectionSchema> {
  console.log('Loading schema...');
  return (
    await Axios.post(url, {
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function parseSchema(url: string, customScalars?: Record<string, string>) {
  const jsonSchema = await introspection(url);

  return {
    _generateRootType(name: string, schemaLocation: { name: string } | null, type: string): string {
      if (schemaLocation == null) {
        return loadTemplate('root-type.template.ts', {
          NAME: name,
          TYPE: '{}',
          VALUES: '',
        });
      }
      return loadTemplate('root-type.template.ts', {
        NAME: name,
        TYPE: 'Gql' + schemaLocation.name,
        VALUES: jsonSchema.types
          .find(type => type.name === schemaLocation?.name)
          ?.fields?.sort((l, r) => l.name.localeCompare(r.name))
          .map(query => {
            const { type: returnType, nullable } = mapType(query.type);
            const templateValues = {
              REQUEST_NAME: query.name,
              REQUEST_NAME_CAPITALIZED: capitalize(query.name),
              TYPE: type,
              RETURN_TYPE: `${returnType}${nullable ? ' | null' : ''}`,
            };
            if (query.args.length === 0) {
              return loadTemplate('request.template.ts', templateValues);
            }
            return loadTemplate('request-with-args.template.ts', {
              ...templateValues,
              VARIABLE_DECLARATIONS: query.args
                .map(arg => {
                  const { type, nullable } = mapType(arg.type);
                  return loadTemplate('variable-declaration.template.txt', {
                    TYPE: `${type.replace('Gql', '')}${nullable ? '' : '!'}`,
                    NAME: arg.name,
                  });
                })
                .join(', '),
              VARIABLE_PASSED: query.args
                .map(arg => {
                  return loadTemplate('pass-variable.template.txt', {
                    NAME: arg.name,
                  });
                })
                .join(', '),
              VARIABLE_JSON: query.args
                .map(arg => {
                  return loadTemplate('variable-value.template.txt', {
                    NAME: arg.name,
                    VALUE: arg.name,
                  });
                })
                .join(', '),
            });
          })
          .join(',\n'),
      });
    },
    _generateQueries(): string {
      return this._generateRootType('queries', jsonSchema.queryType, 'query');
    },
    _generateMutations(): string {
      return this._generateRootType('mutations', jsonSchema.mutationType, 'mutation');
    },
    _generateSubscriptions(): string {
      return this._generateRootType('subscriptions', jsonSchema.subscriptionType, 'subscription');
    },

    _generateTypes(): string[] {
      return jsonSchema.types
        .sort((l, r) => (l.name ?? '').localeCompare(r.name ?? ''))
        .map(t => {
          if (
            (jsonSchema.queryType != null && t.name === jsonSchema.queryType?.name) ||
            (jsonSchema.mutationType != null && t.name === jsonSchema.mutationType?.name) ||
            (jsonSchema.subscriptionType != null && t.name === jsonSchema.subscriptionType?.name)
          ) {
            return this._generateQueryType(t);
          }
          switch (t.kind) {
            case 'ENUM': {
              return this._generateEnumType(t);
            }
            case 'SCALAR': {
              return this._generateScalarType(t);
            }
            case 'INPUT_OBJECT': {
              return this._generateInputObjectType(t);
            }
            case 'OBJECT': {
              return this._generateObjectType(t);
            }
            case 'INTERFACE': {
              return this._generateInterfaceType(t);
            }
          }
        })
        .filter(typeString => !!typeString) as string[];
    },
    _generateEnumType(type: IntrospectionFullType): string {
      return loadTemplate('type-enum.template.ts', {
        NAME: type.name,
        VALUES: type.enumValues?.map(value => `${value.name} = "${value.name}"`).join(',\n  '),
      });
    },
    _generateScalarType(type: IntrospectionFullType): string {
      const types: Record<string, string> = {
        Boolean: 'boolean',
        Int: 'number',
        Float: 'number',
        String: 'string',
        Time: 'string',
        ID: 'string',
        ...customScalars,
      };
      const value = type.name && types[type.name];
      if (value == null) throw Error(`Could not alias scalar '${type.name}'`);
      return loadTemplate('type-scalar.template.ts', {
        NAME: type.name,
        VALUE: value,
      });
    },
    _generateObjectType(type: IntrospectionFullType): string {
      return loadTemplate('type-object.template.ts', {
        NAME: type.name,
        FIELDS: type.fields
          ?.map(f => {
            const { type, nullable } = mapType(f.type);
            return `${f.name}${nullable ? '?' : ''}: ${type}`;
          })
          .join(';\n  '),
      });
    },
    _generateInputObjectType(type: IntrospectionFullType): string {
      return loadTemplate('type-object.template.ts', {
        NAME: type.name,
        FIELDS: type.inputFields
          ?.map(f => {
            const { type, nullable } = mapType(f.type);
            return `${f.name}${nullable ? '?' : ''}: ${type}`;
          })
          .join(';\n  '),
      });
    },
    _generateInterfaceType(type: IntrospectionFullType): string {
      console.warn(`- Interface types are not generated right now: ${type.name}`);
      return '';
    },
    _generateQueryType(type: IntrospectionFullType): string {
      const argTemplates: string[] = [];
      const objectTemplate = loadTemplate('type-object.template.ts', {
        NAME: type.name,
        FIELDS: type.fields
          ?.map(f => {
            const { type, nullable } = mapType(f.type);
            if (f.args.length === 0) {
              return `${f.name}(query: string): Promise<${type}${nullable ? ' | null' : ''}>`;
            }
            const argsTypeName = `${capitalize(f.name)}Args`;
            argTemplates.push(
              loadTemplate('type-object.template.ts', {
                NAME: argsTypeName,
                FIELDS: f.args
                  ?.map(f => {
                    const { type, nullable } = mapType(f.type);
                    return `${f.name}${nullable ? '?' : ''}: ${type}`;
                  })
                  .join(';\n  '),
              }),
            );
            return `${f.name}(query: string, args: Gql${argsTypeName}): Promise<${type}${
              nullable ? ' | null' : ''
            }>`;
          })
          .join(';\n  '),
      });

      return [...argTemplates, objectTemplate].join('\n\n');
    },

    generate(outputPath: string) {
      console.log('Generating client...');
      const template = loadTemplate('index.template.ts', {
        NAME: 'AnimeSkip',
        QUERIES: this._generateQueries(),
        MUTATIONS: this._generateMutations(),
        SUBSCRIPTIONS: this._generateSubscriptions(),
        TYPES: this._generateTypes().join('\n\n'),
      });

      fs.writeFileSync(outputPath, template, { encoding: 'utf-8' });

      console.log('Done!\n');
    },
  };
}
