import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestCase } from 'project_orms/dist/entities/testCases';
import { Injectable } from '@nestjs/common';
import { composeTestCaseFilterParams } from 'src/utils/queryUtils';
import { FilterTestCasesParams } from 'project_orms/dist/inputs/testCaseIn';
 
@Injectable()
export class TestCaseQueryService {
  constructor(
    @InjectRepository(TestCase) private testCaseRepository:Repository<TestCase>
  ){}
  getHello(): string {
    return 'Hello World!';
  }

  async filterTestCases(filterParams:FilterTestCasesParams):Promise<{items:TestCase[],count:number}>{
    let tCs:any;
    
    if(filterParams.params && filterParams.params.id){
      // This section handles UUID types specifically i.e not VARCHAR
      tCs = await this.testCaseRepository.findAndCountBy({id:filterParams.params.id})
    }else{
      const filters = composeTestCaseFilterParams(filterParams);
      tCs = await this.testCaseRepository.findAndCount(filters)
    }
  
    return {items:tCs[0], count:tCs[0].length}
  }
}
