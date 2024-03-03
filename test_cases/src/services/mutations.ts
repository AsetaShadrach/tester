import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestDetailsObject, TestCase } from 'project_orms/dist/entities/testCases';
import { RequestDetailsInput, TestCaseInput, TestCaseUpdateInput } from 'project_orms/dist/inputs/testCaseIn';
import { TcRequestService } from 'src/utils/execReqUtils';
import { runConfigs } from 'src/dtos/interfaces';
 
@Injectable()
export class TestCaseMutationService {
  constructor(
    @InjectRepository(TestCase) private readonly testCaseRepository:Repository<TestCase>,
    private readonly tcRequestService:TcRequestService,
  ){}
  async createTestCase(params: TestCaseInput): Promise<any> {
    let response:any;
    response = await this.testCaseRepository.save(params);

    if(params.runAndSave !== 'save_only'){
      
        response = await this.runTestCase(
            {
              saveOption:response?.runAndSave,
              testCaseId:response?.id,
              retryIntervals:response?.retryIntervals,
              retryMaxAttempts:response?.retryMaxAttempts,
              parentId:response?.parentId,
              groupId:response?.groupId,
              testType:response?.testType,
              retryAfterSuccess:response?.retryAfterSuccess,
            },
            params.requestDetails
          );
    }

    return response
  }

  async updateTestCase(id:string, params: TestCaseUpdateInput): Promise<any> {
    const tC = await this.testCaseRepository.save({id:id, ...params});
    return tC;
  }

  async runTestCase(runConfigs:runConfigs, reqParams?:RequestDetailsInput, ){
    let response:any;
    let params:RequestDetailsObject;
    let tC: TestCase;

    // Enable running of already saved requests
    // Only use id to check TC details to run if reqParams are not provided
    if(runConfigs.testCaseId && !reqParams){
      tC = await this.testCaseRepository.findOneBy({id:runConfigs.testCaseId})
      if (tC){
          params = tC.requestDetails;
          console.log(`Runnning pre-saved request ${runConfigs.testCaseId} with params  :: `, params);
      }
    }else{
      params = reqParams;
    }

    if(!params){
      return {
        httpStatus:400,
        message: 'An error occured', 
        response: `Test case params missing or TC ${runConfigs.testCaseId||'' } missing`,
        responseDescription: `Test case params not found`,
        errors: [`Test case params returned ${params}`]
    }
    }
    
    
    if(params.requestType==='post' ){
      response = await this.tcRequestService.executePostRequest(params,runConfigs)
    }else if(params.requestType==='get' ){
      response = await this.tcRequestService.executeGetRequest(params, runConfigs)
    }

    console.log(`Response from running test case ${runConfigs.testCaseId || ''} :: `, response )

    return response
  }

  async runTestGroup(groupId:string){
    // Test This after bulding transactions
    
  }
}
