import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChainTestParams, StringArray } from 'src/dtos/customTypes';
import { E2EProcessService } from 'src/services/processGroupReqUtils.';
import GraphQLJSON from 'graphql-type-json';
import { RunConfigs } from 'project_orms/dist/inputs/testCaseIn';

@Resolver()
export class E2EProcessResolver {
  constructor(private readonly e2EProcessService: E2EProcessService) {}

  @Query(() => String)
  getHello() {
    return 'E2E resolver running !!';
  }

  @Mutation(() => GraphQLJSON)
  async chainTestCases(
    @Args('testCaseIds') testCaseIds: StringArray,
    @Args('chainTestParams') chainTestParams: ChainTestParams,
    @Args('runConfigs') runConfigs: RunConfigs,
  ) {
    return this.e2EProcessService.chainTestCases(
      testCaseIds.items,
      chainTestParams,
      runConfigs,
    );
  }
}
