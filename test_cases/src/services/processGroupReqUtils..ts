import { Injectable } from '@nestjs/common';
import {
  RequestDetailsInput,
  RunConfigs,
  TestCaseInput,
} from 'project_orms/dist/inputs/testCaseIn';
import { ChainTestParams } from 'src/dtos/customTypes';
import { TestCaseMutationService } from 'src/services/mutations';
import { Repository } from 'typeorm';
import { TestCase } from 'project_orms/dist/entities/testCases';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class E2EProcessService {
  constructor(
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,
    private readonly testCaseMutationService: TestCaseMutationService,
  ) {}

  private runConfigs: RunConfigs;

  async processAuthParams(chainTestParams: ChainTestParams) {
    const authParams = chainTestParams.authParams;

    const currentTC = await this.testCaseRepository.findOneBy({
      id: authParams.authId,
    });
    // To create a new TC on run , set parentId to null
    const authInput: TestCaseInput = {
      testCase: this.runConfigs.testCase || 'E2EProcess',
      createdBy: chainTestParams.createdBy,
      description: chainTestParams.createdBy,
      parentId: this.runConfigs.parentId,
      groupId: this.runConfigs.groupId,
      testType: this.runConfigs.testType || 'E2EProcess',
      keysToMaskOnSave: chainTestParams.keysToMaskOnSave,
      runAndSave: this.runConfigs.runAndSave || 'run',
      testReportRecipients: chainTestParams.testReportRecipients,
      retryAfterSuccess: this.runConfigs.retryAfterSuccess,
      status: 'initiated',
      retryMaxAttempts: 1,
      retryIntervals: 0,
      requestDetails: currentTC.requestDetails,
    };

    let response = await this.testCaseMutationService.runTestCase(authInput, {initialTcId: authParams.authId});
    //Automatically pass refence IDs
    this.runConfigs.parentId = response.referenceIds.parentId;
    this.runConfigs.groupId = response.referenceIds.groupId;

    response = response.response;

    for (let ind = 0; ind < authParams.keysToAssignValuesTo.length; ind++) {
      // Only add to the runConfigs if it exists in the response
      if (response[authParams.valuesToPickFromResponse[ind]]) {
        const actaulValue = authParams.prefixWith?.[ind]
          ? authParams.prefixWith?.[ind] +
            response[authParams.valuesToPickFromResponse[ind]]
          : response[authParams.valuesToPickFromResponse[ind]];
        // valuesToPickFromResponse contains list of keys whose values you expect to pull from the response
        // keysToAssignValuesTo are the keys you want to pass in the authheader e.g Authorization
        this.runConfigs[authParams.keysToAssignValuesTo[ind]] = actaulValue;
      }
    }
    console.log(this.runConfigs);

    return;
  }

  async chainTestCases(
    tCaseIds: Array<string>,
    chainTestParams: ChainTestParams,
    e2eRunConfigs?: RunConfigs,
  ) {
    let authId: string;
    this.runConfigs = { ...e2eRunConfigs };
    const authParams = chainTestParams.authParams;

    if (
      authParams.keysToAssignValuesTo.length !==
      authParams.valuesToPickFromResponse.length
    ) {
      return {
        httpStatus: 400,
        message: 'Invalid params',
        responseDescription: 'Length mismatch of auth values',
        errors: [
          'Number of values in keysToAssignValuesTo and valuesToPickFromResponse must match',
        ],
      };
    }

    let lastRunTc: any;
    let lastRunDetails: any;

    for (const id of tCaseIds) {
      if (authParams.cascadeAuth && !authId && authParams.authId === id) {
        authId = authParams.authId;
        await this.processAuthParams(chainTestParams);
      } else {
        const currentTC = await this.testCaseRepository.findOneBy({ id: id });
        const headerParams = currentTC.requestDetails.headerParams;
        const headerParamsToReplace =
          currentTC.requestDetails['headerParamsToReplace'] || '';

        const bodyParams = currentTC.requestDetails.bodyParams;
        const bodyParamsToReplace =
          currentTC.requestDetails['bodyParamsToReplace'] || '';

        const keysToCheck = Object.keys(this.runConfigs);

        for (const key of keysToCheck) {
          headerParams.map((param: string, index: number) => {
            if (
              param.includes(key) &&
              headerParamsToReplace.includes(key) &&
              authParams.replacePattern === 'manual'
            ) {
              const paramArray = param.split(':');
              headerParams[index] = paramArray[0] + ':' + this.runConfigs[key];
            } else if (
              param.includes(key) &&
              authParams.replacePattern === 'auto'
            ) {
              const paramArray = param.split(':');
              headerParams[index] = paramArray[0] + ':' + this.runConfigs[key];
            }
          });
        }

        for (const key of keysToCheck) {
          bodyParams.map((param: string, index: number) => {
            if (
              param.includes(key) &&
              bodyParamsToReplace.includes(key) &&
              authParams.replacePattern === 'manual'
            ) {
              const paramArray = param.split(':');
              bodyParams[index] =
                paramArray[0] +
                ':' +
                this.runConfigs[key] +
                ':' +
                paramArray[2];
            } else if (
              param.includes(key) &&
              authParams.replacePattern === 'auto'
            ) {
              const paramArray = param.split(':');
              bodyParams[index] =
                paramArray[0] +
                ':' +
                this.runConfigs[key] +
                ':' +
                paramArray[2];
            }
          });
        }

        const newReqDetails: RequestDetailsInput = {
          ...currentTC.requestDetails,
          headerParams: headerParams,
        };
        const newTc: TestCaseInput = {
          ...currentTC,
          requestDetails: newReqDetails,
          keysToMaskOnSave: [],
          runAndSave: this.runConfigs.runAndSave || 'run_only',
          parentId: this.runConfigs.parentId,
        };

        await this.testCaseMutationService.runTestCase(newTc, {
          initialTcId: id
        });

        lastRunTc = {
          id: id,
          testCase: currentTC.testCase,
          testType: currentTC.testType,
        };

        lastRunDetails = newReqDetails;
      }
    }

    const Tc = await this.testCaseRepository.findOneBy({
      id: this.runConfigs.parentId,
    });

    const newExpRespDetails = {
      ...Tc.expectedResponseDetails,
      testCaseIds: [authParams.authId, ...tCaseIds],
    };

    Tc.expectedResponseDetails = newExpRespDetails;

    await this.testCaseRepository.save(Tc);

    return {
      httpStatus: 200,
      message: 'Completed running test case succesfully',
      response: {
        parentId: this.runConfigs.parentId,
        groupId: this.runConfigs.groupId,
        authId: chainTestParams.authParams.authId,
        lastRunTc: lastRunTc,
        lastRunDetails: lastRunDetails,
      },
    };
  }
}
