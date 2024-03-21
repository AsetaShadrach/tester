import { Field, InputType, createUnionType } from '@nestjs/graphql';
import { GraphQLFloat, GraphQLInt, GraphQLString } from 'graphql';
import { TestCaseUpdateInput } from 'project_orms/dist/inputs/testCaseIn';

export const FilterTestCasesUI = createUnionType({
  name: 'FilterTestCasesUI',
  types: () => [null, TestCaseUpdateInput] as const,
  resolveType(reqParams) {
    if (!reqParams) {
      return null;
    }
    return TestCaseUpdateInput;
  },
});

@InputType('StringArray')
export class StringArray {
  @Field(() => [GraphQLString], { nullable: true })
  items: Array<string>;
}

@InputType('IntegerArray')
export class IntegerArray {
  @Field(() => [GraphQLInt], { nullable: true })
  items: Array<string>;
}

@InputType('FloatArray')
export class FloatArray {
  @Field(() => [GraphQLFloat], { nullable: true })
  items: Array<string>;
}

@InputType()
export class E2EAuthParams {
  @Field(() => Boolean)
  cascadeAuth: boolean;
  @Field()
  authId: string;
  @Field(() => [GraphQLString])
  keysToAssignValuesTo: Array<string>;
  @Field(() => [GraphQLString])
  valuesToPickFromResponse: Array<string>;
  @Field(() => [GraphQLString], {
    description: 'What to prefix the specified header with e.g "Bearer "',
  })
  prefixWith: Array<string>;
  @Field({
    defaultValue: 'skip',
    description:
      'auto: runConfigkeys will be auto replaced , skip: no replacing will happen, manual: replaced as specified by request details',
  })
  replacePattern: string;
}

@InputType()
export class ChainTestParams {
  @Field(() => E2EAuthParams)
  authParams: E2EAuthParams;
  @Field({ nullable: true })
  createdBy: string;
  @Field({ nullable: true })
  description: string;
  @Field(() => GraphQLString, { nullable: true })
  testReportRecipients: string;
  @Field(() => [GraphQLString], { nullable: true })
  keysToMaskOnSave: Array<string>;
}
