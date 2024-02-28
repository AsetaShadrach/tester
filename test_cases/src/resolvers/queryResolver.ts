import { Query, Args, Resolver } from '@nestjs/graphql';
import { TestCaseQueryResponse } from 'project_orms/dist/entities/testCases';
import { FilterTestCasesParams } from 'project_orms/dist/inputs/testCaseIn';
import { TestCaseQueryService } from 'src/services/queries';

@Resolver()
export class TestCaseQueryResolver {
  constructor(
    private readonly queryService: TestCaseQueryService,
  ) {}

  @Query(()=>String)
  getHello(){
    return 'TestCaseQueryService is up';
  }

  @Query(()=>TestCaseQueryResponse)
  async filterTestCases(
    @Args('filterParams') params:FilterTestCasesParams,
  ){
    console.log("Gets to the filter")
    return this.queryService.filterTestCases(params);
  }
}
