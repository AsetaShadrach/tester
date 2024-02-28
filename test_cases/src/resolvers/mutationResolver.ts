import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TestCaseMutationService } from '../services/mutations';
import { GenericTypeObject, TestCase, TestCaseMutateResponse } from 'project_orms/dist/entities/testCases';
import { RequestDetailsInput, TestCaseInput } from 'project_orms/dist/inputs/testCaseIn';


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
    @Args('tCRunOptions',{nullable:true}) tCRunOptions?:RequestDetailsInput,
    @Args('tCId',{nullable:true}) tCId?:string,
    @Args('tCSaveOption',{nullable:true, defaultValue:"run_only"}) tCSaveOption?:string,
    @Args('retryIntervals',{nullable:true, defaultValue:1}) retryIntervals?:number,
    @Args('retryMaxAttempts',{nullable:true, defaultValue:1}) retryMaxAttempts?:number,
  ){

    return this.mutationService.runTestCase({
      saveOption: tCSaveOption, 
      testCaseId: tCId, 
      retryIntervals: retryIntervals, 
      retryMaxAttempts: retryMaxAttempts,
    },
    tCRunOptions)
  }
}
