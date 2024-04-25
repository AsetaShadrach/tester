import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosRequestConfig } from 'axios';
import { TestCase } from 'project_orms/dist/entities/testCases';
import { Observable, lastValueFrom, map, repeat } from 'rxjs';
import { runConfigs } from 'src/dtos/interfaces';
import { Repository } from 'typeorm';
import * as querystring from 'querystring';

@Injectable()
export class TcRequestService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,
  ) {}

  // Update test case history after response
  async updateTestCaseHistory(
    testCaseId: string,
    data: any,
    requestedAt: Date,
    responseArray: Array<any>,
    runConfigs?: any,
  ) {
    const tC = await this.testCaseRepository.findOneBy({ id: testCaseId });

    console.log(`Updating request history for ${testCaseId}`);

    if (tC.requestHistory) {
      tC.requestDetails = runConfigs?.requestDetails;
      // do not updated testCase meta on every request if its end to end testCase
      if (!tC.testType.includes('E2E')) {
        tC.testCase = runConfigs?.testCase;
        tC.description = runConfigs?.description;
        tC.groupId = runConfigs?.groupId;
        tC.testType = runConfigs?.testType;
      }

      tC.requestHistory.push({
        request: data,
        requestedAt: requestedAt.toISOString(),
        respondedAt: new Date().toISOString(),
        response: responseArray,
      });
      await this.testCaseRepository.save(tC);
    } else {
      // Default time thresholds
      const timeThresholds = {
        best: 300,
        good: 600,
        okay: 1200,
        bad: 2400,
        terrible: 4800,
      };

      const expectedResponseDetails = {
        ...tC.expectedResponseDetails,
        testCaseIds: [tC.id],
        timeThresholds: timeThresholds,
      };

      tC.expectedResponseDetails = expectedResponseDetails;

      tC.requestHistory = [
        {
          request: data,
          requestedAt: requestedAt.toISOString(),
          respondedAt: new Date().toISOString(),
          response: responseArray,
        },
      ];
      await this.testCaseRepository.save(tC);
    }
  }

  async processHttpErrorResponse(
    error: any,
    runConfigs: runConfigs,
    params?: any,
    requestedAt?: any,
  ) {
    const responseArray: Array<any> = [];
    let errorResponse: any;
    let parentId: any = runConfigs.parentId;

    if (error.response) {
      // Switched from array of strings to arrya of JSONs
      if (typeof error.response.data == 'string') {
        responseArray.push(error.response.data);
      } else if (Array.isArray(error.response.data)) {
        responseArray.push(...error.response.data);
      } else {
        responseArray.push(error.response.data);
      }

      errorResponse = {
        httpStatus: error.response.status || 500,
        message: 'An error occured',
        response: error.response.statusText,
        responseDescription: `An error occured on processing request ${runConfigs.parentId}`,
        errors: responseArray,
      };
    } else if (error.stack) {
      responseArray.push(error.stack);

      errorResponse = {
        httpStatus: 400,
        message: 'An error occured',
        response: error.message,
        responseDescription: `An error occured on processing request for ${runConfigs.parentId}`,
        errors: responseArray,
      };
    }

    if (runConfigs.runAndSave && runConfigs.runAndSave.includes('save')) {
      console.log('Saving history for request ', runConfigs.parentId);

      if (runConfigs.parentId) {
        await this.updateTestCaseHistory(
          runConfigs.parentId,
          params,
          requestedAt,
          responseArray,
          runConfigs,
        );
      } else {
        // If there is no parentId i.e TestCase is not tied to any chain of tests or is an individual test and is flagged to be saved
        const resp = await this.testCaseRepository.save(runConfigs);
        parentId = resp.id;
      }
    }

    errorResponse.referenceIds = {
      parentId: parentId,
      groupId: runConfigs.groupId,
    };

    return errorResponse;
  }

  async executePostRequest(params?: any, runConfigs?: runConfigs) {
    const requestedAt = new Date();
    let parentId = runConfigs?.parentId;
    try {
      const form: any = {};
      for (const val of params.bodyParams) {
        const keyVal = val.split(':');
        if (keyVal[0].includes('.')) {
          // Then this is a json
          const jsonKeys = keyVal[0].split('.');

          if (!keyVal[2]) {
            const newVal = { [jsonKeys[1]]: keyVal[1] };
            form[`${jsonKeys[0]}`] = { ...form[`${jsonKeys[0]}`], ...newVal };
          } else if (keyVal[2] === 'int') {
            const newVal = { [jsonKeys[1]]: parseInt(keyVal[1]) };
            form[`${jsonKeys[0]}`] = { ...form[`${jsonKeys[0]}`], ...newVal };
          } else if (keyVal[2] === 'float') {
            const newVal = { [jsonKeys[1]]: parseFloat(keyVal[1]) };
            form[`${jsonKeys[0]}`] = { ...form[`${jsonKeys[0]}`], ...newVal };
          }
        } else {
          if (!keyVal[2]) {
            form[keyVal[0]] = keyVal[1];
          } else if (keyVal[2] === 'int') {
            form[keyVal[0]] = parseInt(keyVal[1]);
          } else if (keyVal[2] === 'float') {
            form[keyVal[0]] = parseFloat(keyVal[1]);
          }
        }
      }

      const headers: any = {};
      for (const val of params.headerParams) {
        const keyVal = val.split(':');
        headers[keyVal[0]] = keyVal[1];
      }

      const reqConfigs: AxiosRequestConfig = {
        headers: headers,
        method: headers.method.toUpperCase(),
      };

      let dataToSend: any;

      if (
        ['post', 'put'].includes(headers.method) &&
        !headers['Content-Type']
      ) {
        const errors: Array<any> = [];
        if (!headers['Content-Type']) {
          errors.push('Missing header param : Content-Type');
        }

        return {
          httpStatus: 400,
          message: 'An error occured',
          response: 'Invalid header params or not all header params present',
          referenceIds: {
            parentId: parentId,
            groupId: runConfigs.groupId,
          },
          responseDescription: `Request ${runConfigs.parentId || ''} failed`,
          errors: errors,
        };
      }
      if (headers['Content-Type'].includes('form')) {
        dataToSend = querystring.stringify(form);
      } else if (!headers['Content-Type'].includes('form')) {
        dataToSend = form;
      }

      let obsv: Observable<any>;
      if (headers.method == 'post') {
        obsv = this.httpService.post(params.url, dataToSend, reqConfigs).pipe(
          repeat({
            count: runConfigs.retryMaxAttempts,
            delay: runConfigs.retryIntervals * 1000,
          }),
          map(async (response: any) => {
            return response;
          }),
        );
      }

      if (headers.method == 'put') {
        obsv = this.httpService.put(params.url, dataToSend, reqConfigs).pipe(
          repeat({
            count: runConfigs.retryMaxAttempts,
            delay: runConfigs.retryIntervals * 1000,
          }),
          map(async (response: any) => {
            return response;
          }),
        );
      }

      if (headers.method == 'patch') {
        obsv = this.httpService.patch(params.url, dataToSend, reqConfigs).pipe(
          repeat({
            count: runConfigs.retryMaxAttempts,
            delay: runConfigs.retryIntervals * 1000,
          }),
          map(async (response: any) => {
            return response;
          }),
        );
      }

      const observableResponse = await lastValueFrom(obsv);

      console.log('POST ObservableResponse =============================');
      console.log(observableResponse);
      console.log('================================================');
      const response = {
        status: observableResponse.status,
        statusText: observableResponse.statusText,
        data: observableResponse.data,
      };

      if (runConfigs.parentId) {
        await this.updateTestCaseHistory(parentId, params, requestedAt, [
          response,
          runConfigs,
        ]);
      } else {
        const tC = await this.testCaseRepository.save(runConfigs);
        parentId = tC.id;
        console.log(`Saved the run configuration for test case ${parentId}`);
        await this.updateTestCaseHistory(parentId, params, requestedAt, [
          response,
        ]);
      }

      return {
        httpStatus: response.status,
        message: response.statusText,
        response: response.data,
        referenceIds: {
          parentId: parentId,
          groupId: runConfigs.groupId,
        },
        responseDescription: `Request ${runConfigs.parentId || ''} succesfully run`,
      };
    } catch (error) {
      console.log('Error processing post request ', error);
      const response = await this.processHttpErrorResponse(
        error,
        runConfigs,
        params,
        requestedAt,
      );
      return response;
    }
  }

  async executeGetRequest(params: any, runConfigs?: runConfigs) {
    const requestedAt = new Date();
    let parentId = runConfigs?.parentId;
    try {
      const headers: any = {};

      // Formart query params into a query string
      if (params.queryParams) {
        let queryStringList: Array<string>;
        for (const query of params.queryParams) {
          const keyVal = query.split(':');
          queryStringList.push(`${keyVal[0]}=${keyVal[1]}`);
        }
        params.url = params.url + '?' + queryStringList.join('&');
      }

      for (const val of params.headerParams) {
        const keyVal = val.split(':');
        headers[keyVal[0]] = keyVal[1];
      }

      const reqConfigs: AxiosRequestConfig = {
        headers: headers,
        method: headers.method.toUpperCase(),
      };

      const obsv: Observable<any> = this.httpService
        .get(params.url, reqConfigs)
        .pipe(
          repeat({
            count: runConfigs.retryMaxAttempts,
            delay: runConfigs.retryIntervals * 1000,
          }),
          map(async (response: any) => {
            return response;
          }),
        );

      const observableResponse = await lastValueFrom(obsv);

      console.log('GET ObservableResponse =============================');
      console.log(observableResponse);
      console.log('================================================');
      const response = {
        status: observableResponse.status,
        statusText: observableResponse.statusText,
        data: observableResponse.data,
      };

      if (runConfigs.parentId) {
        await this.updateTestCaseHistory(
          parentId,
          params,
          requestedAt,
          [response],
          runConfigs,
        );
      } else {
        const tC = await this.testCaseRepository.save(runConfigs);
        parentId = tC.id;
        console.log(`Saved the run configuration for test case ${parentId}`);
        await this.updateTestCaseHistory(parentId, params, requestedAt, [
          response,
        ]);
      }

      return {
        httpStatus: response.status,
        message: response.statusText,
        response: response.data,
        referenceIds: {
          parentId: parentId,
          groupId: runConfigs.groupId,
        },
        responseDescription: `Request ${runConfigs.parentId || ''} succesfully run`,
      };
    } catch (error) {
      console.log('Error processing post request ', error);
      const response = await this.processHttpErrorResponse(
        error,
        runConfigs,
        params,
        requestedAt,
      );
      return response;
    }
  }

  async executeDeleteRequest(params?: any, runConfigs?: runConfigs) {
    const requestedAt = new Date();
    let parentId = runConfigs?.parentId;
    try {
      const headers: any = {};
      for (const val of params.headerParams) {
        const keyVal = val.split(':');
        headers[keyVal[0]] = keyVal[1];
      }

      const reqConfigs: AxiosRequestConfig = {
        headers: headers,
        method: headers.method.toUpperCase(),
      };

      const obsv: Observable<any> = this.httpService
        .delete(params.url, reqConfigs)
        .pipe(
          repeat({
            count: runConfigs.retryMaxAttempts,
            delay: runConfigs.retryIntervals * 1000,
          }),
          map(async (response: any) => {
            return response;
          }),
        );

      const observableResponse = await lastValueFrom(obsv);

      console.log('DELETE ObservableResponse =============================');
      console.log(observableResponse);
      console.log('================================================');
      const response = {
        status: observableResponse.status,
        statusText: observableResponse.statusText,
        data: observableResponse.data,
      };

      if (runConfigs.parentId) {
        await this.updateTestCaseHistory(parentId, params, requestedAt, [
          response,
        ]);
      } else {
        const tC = await this.testCaseRepository.save(runConfigs);
        parentId = tC.id;
        console.log(`Saved the run configuration for test case ${parentId}`);
        await this.updateTestCaseHistory(parentId, params, requestedAt, [
          response,
        ]);
      }

      return {
        httpStatus: response.status,
        message: response.statusText,
        response: response.data,
        referenceIds: {
          parentId: parentId,
          groupId: runConfigs.groupId,
        },
        responseDescription: `Request ${runConfigs.parentId || ''} succesfully run`,
      };
    } catch (error) {
      console.log('Error processing post request ', error);
      const response = await this.processHttpErrorResponse(
        error,
        runConfigs,
        params,
        requestedAt,
      );
      return response;
    }
  }
}
