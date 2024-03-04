import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TestCaseMutationService } from '../services/mutations';
import { TestCase, TestCaseMutateResponse } from 'project_orms/dist/entities/testCases';
import { TestCaseInput } from 'project_orms/dist/inputs/testCaseIn';


@Resolver()
export class TestCaseMutationsResolver {
  constructor(
    private readonly mutationService: TestCaseMutationService
  ) {}


  @Mutation(() => TestCaseMutateResponse)
  async createTestCase(
    @Args('params') params: TestCaseInput
  ){
    return this.mutationService.createTestCase(params)
  }

  @Mutation(() => TestCase)
  async updateTestCase(
    @Args('testCaseId') id: string,
    @Args('updateParams') params: TestCaseInput
  ){
    return this.mutationService.updateTestCase(id, params)
  }


  @Mutation(() => TestCaseMutateResponse)
  async runTestCase(
    @Args('tCRunInput',{nullable:true}) tCRunInput:TestCaseInput,
  ){

    return this.mutationService.runTestCase(tCRunInput)
  }
}
