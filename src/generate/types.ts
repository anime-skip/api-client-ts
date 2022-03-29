export interface Deprecation {
  isDeprecated: boolean;
  deprecationReason?: string;
}

export interface Field extends Deprecation {
  name: string;
  description?: string;
  type: Type;
}

export type Type =
  | EnumType
  | ObjectType
  | InputObjectType
  | ScalarType
  | InterfaceType
  | ListType
  | NonNullType
  | HardCodedType;

export interface HardCodedType {
  kind: 'HARD_CODED';
  value: string;
}

export interface EnumType {
  kind: 'ENUM';
  name: string;
  description?: string;
  enumValues: Array<
    {
      name: string;
      description?: string;
    } & Deprecation
  >;
}

export interface ListType {
  kind: 'LIST';
  ofType: Type;
}

export interface NonNullType {
  kind: 'NON_NULL';
  ofType: Type;
}

export interface ObjectType {
  kind: 'OBJECT';
  name: string;
  description?: string;
  fields: Field[];
}

export interface InputObjectType {
  kind: 'INPUT_OBJECT';
  name: string;
  description?: string;
  fields: Field[];
}

export interface ScalarType {
  kind: 'SCALAR';
  name: string;
  description?: string;
}

export interface InterfaceType {
  kind: 'INTERFACE';
  name: string;
  description?: string;
  fields: Field[];
  possibleTypes: Type[];
}

export interface Argument {
  name: string;
  /**
   * Field not passed returned in the schema, it has to be set manually
   */
  optional?: boolean;
  description?: string;
  type: Type;
  defaultValue?: string;
}

export interface ResolverMethod extends Deprecation {
  name: string;
  description?: string;
  args: Argument[];
  /**
   * The return type
   */
  type: Type;
}

export interface RootResolverType {
  kind: 'OBJECT';
  name: string;
  fields: ResolverMethod[];
}

export interface IntrospectedSchema {
  types: Type[];
  // directives: IntrospectedDirective[];
}

// Simplified helpers

export interface ParsedSchema {
  mutations: RootResolverType[];
  queries: RootResolverType[];
  subscriptions: RootResolverType[];
  types: Array<InputObjectType | ObjectType | InterfaceType>;
  scalars: ScalarType[];
  enums: EnumType[];
}
