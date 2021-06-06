type IntrospectionKind = 'ENUM' | 'INPUT_OBJECT' | 'OBJECT' | 'SCALAR' | 'INTERFACE';

export interface IntrospectionType {
  kind: IntrospectionKind | 'NON_NULL' | 'LIST';
  name?: string;
  ofType?: IntrospectionType;
}

interface IntrospectionInputValue {
  name: string;
  description?: string;
  type: IntrospectionType;
  defaultValue: string;
}

export interface IntrospectionFullType {
  kind: IntrospectionKind;
  name?: string;
  description?: string;
  fields?: Array<{
    name: string;
    description?: string;
    args: IntrospectionInputValue[];
    type: IntrospectionType;
    isDeprecated: boolean;
    deprecationReason?: string;
  }>;
  inputFields?: IntrospectionInputValue[];
  interfaces?: IntrospectionType[];
  enumValues?: Array<{
    name: string;
    description?: string;
    isDeprecated: boolean;
    deprecationReason?: string;
  }>;
  possibleTypes?: IntrospectionType[];
}

export interface IntrospectionSchema {
  queryType: { name: string } | null;
  mutationType: { name: string } | null;
  subscriptionType: { name: string } | null;
  types: IntrospectionFullType[];
  //   directives: IntrospectionDirective[];
}
