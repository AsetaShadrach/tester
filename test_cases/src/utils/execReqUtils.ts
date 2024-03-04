import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AxiosRequestConfig } from "axios";
import { TestCase } from "project_orms/dist/entities/testCases";
import { lastValueFrom, map, repeat } from "rxjs";
import { runConfigs } from "src/dtos/interfaces";
import { Repository } from "typeorm";
let querystring = require('querystring');

@Injectable()
export class TcRequestService{
    constructor(
        private readonly httpService:HttpService,
        @InjectRepository(TestCase) private readonly testCaseRepository:Repository<TestCase>,
    ){}

    // uUpdate test case history after response
    async updateTestCaseHistory(testCaseId : string, data:any, requestedAt:Date, responseArray:Array<string>){
        const tC = await this.testCaseRepository.findOneBy({id:testCaseId});

        console.log(`Updating request history for ${testCaseId}`)

        if(tC.requestHistory){
            tC.requestHistory.push(
                {
                    request : data,
                    requestedAt : requestedAt.toISOString(),
                    respondedAt : new Date().toISOString(),
                    response : responseArray
                }
            )
            await this.testCaseRepository.save(tC)
        }else{

            tC.requestHistory = [{
                    request : data,
                    requestedAt : requestedAt.toISOString(),
                    respondedAt : new Date().toISOString(),
                    response : responseArray
                }]
            await this.testCaseRepository.save(tC)
        }
    }

    async convertReqDetailsToFormInput(reqDetailsArray:Array<string>){
        
    };

    async convertReqDetailsToJsonInput(reqDetailsArray:Array<string>){
        
    };

    async convertReqDetailsToXMLInput(reqDetailsArray:Array<string>){
        
    };

    async processHttpErrorResponse(error:any, runConfigs:runConfigs, params?:any, requestedAt?:any){
        let responseArray:Array<string> = [];
        let errorResponse:any;
        let parentId:any =  runConfigs.parentId;

        if(error.response){
            console.error(error.response.status, error.response.statusText, error.response.data)
                
            responseArray.push(`status: ${error.response.status} , `+
            `statusText : ${error.response.statusText}, data : ${error.response.data.error}`)

            errorResponse = {
                httpStatus: error.response.status || 500,
                message: 'An error occured', 
                response: error.response.statusText,
                responseDescription: `An error occured on processing request ${runConfigs.parentId}`,
                errors: responseArray
            }

        }else if(error.stack){
            responseArray.push(error.stack)

            errorResponse = {
                httpStatus: 400,
                message: 'An error occured', 
                response: error.message,
                responseDescription: `An error occured on processing request for ${runConfigs.parentId}`,
                errors: responseArray
            }
        }

        if( runConfigs.saveOption && 
            runConfigs.saveOption.includes('save')){
                console.log("Saving history for request ", runConfigs.parentId)

                if(runConfigs.parentId){
                    await this.updateTestCaseHistory(
                        runConfigs.parentId, params, requestedAt, responseArray
                    )
                }else{
                    // If there is no parentId i.e TestCase is not tied to any chain of tests or is an individual test and is flagged to be saved
                    const resp = await this.testCaseRepository.save(runConfigs)
                    parentId = resp.id
                }
            }

        errorResponse.referenceIds = {
            parentId: parentId,
            groupId: runConfigs.groupId,
        }

        return errorResponse;

    }

    async executePostRequest(params?:any, runConfigs?: runConfigs){
        const requestedAt = new Date();
        let parentId = runConfigs?.parentId;
        try {
            let form:any = {}
            for (let val of params.bodyParams){
                const keyVal = val.split(':');
                if(!keyVal[2]){
                    form[keyVal[0]] = keyVal[1];
                }else if(keyVal[2]==='int'){
                    form[keyVal[0]] = parseInt(keyVal[1]);
                }else if(keyVal[2]==='float'){
                    form[keyVal[0]] = parseFloat(keyVal[1]);
                }
            }

            let headers:any = {}
            for (let val of params.headerParams){
                const keyVal = val.split(':');
                headers[keyVal[0]] = keyVal[1];
            }

            const reqConfigs:AxiosRequestConfig = {
                headers:headers,
                method:params.requestType.toUpperCase(),
            }
            
            const obsv = this.httpService.post(
                params.url, querystring.stringify(form), reqConfigs
                ).pipe(
                    repeat({
                        count: runConfigs.retryMaxAttempts,
                        delay: runConfigs.retryIntervals*1000
                    }),                    
                    map(async (response:any) =>{
                        return response.data
                    }),
                ); 
            
            const response = await lastValueFrom(obsv)
            if(runConfigs.parentId){
                await this.updateTestCaseHistory(
                    parentId, params, requestedAt, [response]
                )
            }else{
                const tC = await this.testCaseRepository.save(runConfigs);
                parentId = tC.id;                
                console.log(`Saved the run configuration for test case ${parentId}`)
                await this.updateTestCaseHistory(
                    parentId, params, requestedAt, [response]
                )
            }

            return {
                    httpStatus: 200,
                    message: 'Successfull post request', 
                    response: response,
                    referenceIds: {
                        parentId: parentId,
                        groupId: runConfigs.groupId,
                    },
                    responseDescription: `Request ${runConfigs.parentId || ''} succesfully run`
                }
        } catch (error) {
            console.log("Error processing post request ", error)
            const response = await this.processHttpErrorResponse(error, runConfigs, params, requestedAt)            
            return response;
        }
    }

    async executeGetRequest(params:any, configs:runConfigs,){
        console.log(params.requestType)
        console.log(params.url)
        console.log(params.bodyParams)
        console.log(params.queryParams)
    }
}