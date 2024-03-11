import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RequestDetailsObject,
  TestCase,
} from 'project_orms/dist/entities/testCases';
import {
  TestCaseInput,
  TestCaseUpdateInput,
} from 'project_orms/dist/inputs/testCaseIn';
import { TcRequestService } from 'src/utils/execReqUtils';

@Injectable()
export class TestCaseMutationService {
  constructor(
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,
    private readonly tcRequestService: TcRequestService,
  ) {}
  async createTestCase(params: TestCaseInput): Promise<any> {
    let response: any;
    response = await this.testCaseRepository.save(params);

    if (params.runAndSave !== 'save_only') {
      response = await this.runTestCase(response);
    }

    return response;
  }

  async updateTestCase(id: string, params: TestCaseUpdateInput): Promise<any> {
    const tC = await this.testCaseRepository.save({ id: id, ...params });
    return tC;
  }

  async runTestCase(runInputs: TestCaseInput) {
    let response: any;
    let params: RequestDetailsObject;
    let tC: TestCase;

    // If emailing option is specified make sure there are emails.
    if (
      runInputs.runAndSave.includes['email'] &&
      !runInputs.testReportRecipients
    ) {
      return {
        httpStatus: 400,
        message: 'An error occured',
        response: `testReportRecipients expected one or more emails; found ${runInputs.testReportRecipients}`,
        responseDescription:
          `For runAndSave option ${runInputs.runAndSave} test recipient emails are expected at testReportRecipients. ` +
          'If you did not wish to send out test report emails, change the runAndSave option',
        errors: [
          {
            trace: 'Test recipient emails expected at testReportRecipients.',
            suggest:
              'If you did not wish to send out test report emails, change the runAndSave option',
          },
        ],
      };
    }

    // Enable running of already saved requests
    // Only use id to check TC details to run if reqParams are not provided
    if (runInputs.parentId && !runInputs.requestDetails) {
      tC = await this.testCaseRepository.findOneBy({ id: runInputs.parentId });
      if (tC) {
        params = tC.requestDetails;
        console.log(
          `Runnning pre-saved request ${runInputs.parentId} with params  :: `,
          params,
        );
      }
    } else {
      params = runInputs.requestDetails;
    }

    if (!params) {
      return {
        httpStatus: 400,
        message: 'An error occured',
        response: `Test case params missing or TC ${runInputs.parentId || ''} missing`,
        responseDescription: 'Test case params not found',
        errors: [`Test case params returned ${params}`],
      };
    }

    if (['post', 'patch', 'put'].includes(params.requestType)) {
      response = await this.tcRequestService.executePostRequest(
        params,
        runInputs,
      );
    } else if (params.requestType === 'get') {
      response = await this.tcRequestService.executeGetRequest(
        params,
        runInputs,
      );
    } else if (params.requestType === 'delete') {
      response = await this.tcRequestService.executeDeleteRequest(
        params,
        runInputs,
      );
    }

    console.log(
      `Response from running test case ${runInputs.parentId || ''} :: `,
      response,
    );

    return response;
  }
}
