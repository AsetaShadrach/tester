import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TestCase } from "project_orms/dist/entities/testCases";
import { In, Repository } from "typeorm";


@Injectable()
export class TimeAggregations{
    constructor(
        @InjectRepository(TestCase)
        private readonly testCaseRepository: Repository<TestCase>,
    ){}


    async getReqRespTimeDiff(response:any, convertTo?:string){
        // returns response in milliseconds but will be converted depending on the specifed convertion
        
        let timeDivisor:number;

        if(convertTo =='seconds'){
            timeDivisor = 1000;
        }else if(convertTo =='minutes'){
            timeDivisor = 1000*60;
        }else{
            timeDivisor = 1
        }

        return (new Date(response.respondedAt).valueOf() - new Date(response.requestedAt).valueOf())/timeDivisor;
    }

    // Find the method that the test was passed with
    async getReqMethod(request:any){
        for (let headerParam of request.headerParams){
            if(headerParam.includes('method')){
                return headerParam.split(':')[1]
            }
        }
    }

    // Get the count per method
    async getAverageMethodCount(responseArray:Array<any>){
        let methodCount:any = {}
        responseArray.map(async (response:any)=>{
            let method = await this.getReqMethod(response.request);

            if(!methodCount[method]){
                methodCount[method] = 0;
            }
            methodCount[method] = methodCount[method]+1 ;

            }
        )

        return methodCount
    }

    // Individual execution times per test
    async getExecutionTimesPerTest(responseArray:Array<any> , convertTo?:string):Promise<Array<any>>{
        let summary:Array<any>  = []
        
        for ( let response of responseArray){
            summary.push({
                id: response.request.initialTcId,
                url: response.request.url,
                executionTime: await this.getReqRespTimeDiff(response, convertTo)
            });
        }

        return summary;    
    };
            
    //  Get the summary of the execution times of the method from start to end of the request chain
    async getAvgExecutionTimes(responseArray:Array<any>, convertTo?:string){
        const timeDiffArray = await this.getExecutionTimesPerTest(responseArray,convertTo);
        const totalTime = timeDiffArray.reduce((accumulator,timeDiffObject)=> accumulator + timeDiffObject.executionTime, 0);
        const sortedTimeDiffArray = timeDiffArray.sort()

        return {
            total: totalTime,
            totalAverage:  totalTime/timeDiffArray.length,
            min: sortedTimeDiffArray[0],
            max: sortedTimeDiffArray[timeDiffArray.length-1],
        }
    }


    // Avg time for post's/delete's/get's
    async getAvgExecutionTimesPerMethod(responseArray:Array<any>){
        const methodCount = await this.getAverageMethodCount(responseArray) ;
        let summary = {};

        for(let method of Object.keys(methodCount)){            
            let arrayToUse = responseArray.map(async(resp) => {
                const methodFound = await this.getReqMethod(resp.request);
                if (methodFound == method) {
                    return resp;
                }});
            arrayToUse = await Promise.all(arrayToUse)
            arrayToUse = arrayToUse.filter(val=>val!=undefined);
            summary[method] = await this.getAvgExecutionTimes(arrayToUse);
        }
        return summary;
    };


    async getTcThresholdDetails(ids:Array<string>){
        if (!ids){
            return {
                httpStatus: 400,
                message: 'An error occured',
                response: `expectedResponseDetails.testCaseIds expected one or more values; found ${undefined}`,
                responseDescription:
                'An error occured tring to read test case Ids from parent test case',
                errors: [
                {
                    trace: 'Test Case IDs expected at expectedResponseDetails.',
                    suggest:
                    'Add and array of Test Case Ids for key "testCaseIds" in expectedResponseDetails ',
                },
                ],
            };
        }
        const tCs = await this.testCaseRepository.findBy({id: In(ids)});
        let thresholdDetails:any = {};

        for(let tC of tCs){
            if(!tC.expectedResponseDetails){
                return  {
                    httpStatus: 400,
                    message: 'An error occured',
                    response: `expectedResponseDetails expected one or more values; found ${ tC.expectedResponseDetails }`,
                    responseDescription:
                    `expectedResponseDetails is expected to be non null when precessing test case summary. Pass expectedResponseDetails for test case ${tC.id}`,
                    errors: [
                    {
                        trace: 'expectedResponseDetails is expected to be non null',
                        suggest:
                        'Add summary values under the column expectedResponseDetails e.g "testCaseIds" ',
                    },
                    ],
                };
            };


            if(!tC.expectedResponseDetails['timeThresholds']){
                return  {
                    httpStatus: 400,
                    message: 'An error occured',
                    response: `expectedResponseDetails expected one or more values for timeThresholds; found ${ tC.expectedResponseDetails['timeThresholds']}`,
                    responseDescription:
                    `expectedResponseDetails.timeThresholds is expected to be non null when precessing test case summary. Add the timeThresholds for test case ${tC.id}`,
                    errors: [
                    {
                        trace: 'timeThresholds expected in expectedResponseDetails.',
                        suggest:
                        'Add timeThresholds under the column expectedResponseDetails.',
                    },
                    ],
                };
            };

            thresholdDetails[tC.id] = tC.expectedResponseDetails['timeThresholds'] ? tC.expectedResponseDetails['timeThresholds'] : {} ;
        }

        return thresholdDetails;
    }


    async compareVsTimeTresholds(parentId:string){
        const tC = await this.testCaseRepository.findOneBy({id:parentId});

        if(!tC.expectedResponseDetails){
            return {
                httpStatus: 400,
                message: 'An error occured',
                response: `expectedResponseDetails expected one or more values; found ${ tC.expectedResponseDetails}`,
                responseDescription:
                  'expectedResponseDetails is expected to be non null when precessing test case summary',
                errors: [
                  {
                    trace: 'Test Case IDs expected at expectedResponseDetails.',
                    suggest:
                      'Add summary values under the column expectedResponseDetails e.g "testCaseIds" ',
                  },
                ],
              };
        }
        //  Thresholds for each test case with a response in the request history
        const timeThresholds = await this.getTcThresholdDetails(tC.expectedResponseDetails['testCaseIds']);

        if(timeThresholds?.httpStatus){
            return timeThresholds;
        }

        // array of id:time pairs with execution times
        const timesPerTest:Array<any> = await this.getExecutionTimesPerTest(tC.requestHistory);

        let timeThresholdsSummary:any = {};

        for (let tcTimeTest of timesPerTest ){
            // {
            //   id1:{t1,t2,t3},
            //   id2:{t1,t2,t3},
            //  }
            const tCThresholds = timeThresholds[tcTimeTest.id] 
            if(!tCThresholds){
                timeThresholdsSummary[tcTimeTest.id || tcTimeTest.url] = {
                    expectedTime:'Not set' ,
                    currentTime: 'Not compared',
                    remark:'Not set'
                }

            }else{

                console.log(tCThresholds)
                // compare thresholds and assign responses.
                // Assign implicitly
                // best, good, okay, bad, terrible
                if(tcTimeTest.executionTime < tCThresholds.best){
                    timeThresholdsSummary[tcTimeTest.id] = {
                        expectedTime:tCThresholds.best ,
                        currentTime: tcTimeTest.executionTime,
                        remark:'best'
                    };
                
                }else if(tcTimeTest.executionTime < tCThresholds.good){
                    timeThresholdsSummary[tcTimeTest.id] = {
                        expectedTime:tCThresholds.good ,
                        currentTime: tcTimeTest.executionTime,
                        remark:'good'
                    };
                
                }else if(tcTimeTest.executionTime < tCThresholds.okay){
                    timeThresholdsSummary[tcTimeTest.id] = {
                        expectedTime:tCThresholds.okay ,
                        currentTime: tcTimeTest.executionTime,
                        remark:'okay'
                    };
                
                }else if(tcTimeTest.executionTime < tCThresholds.bad){
                    timeThresholdsSummary[tcTimeTest.id] = {
                        expectedTime:tCThresholds.bad ,
                        currentTime: tcTimeTest.executionTime,
                        remark:'bad'
                    };

                }else if(tcTimeTest.executionTime < tCThresholds.terrible){
                    timeThresholdsSummary[tcTimeTest.id] = {
                        expectedTime: tCThresholds.terrible ,
                        currentTime: tcTimeTest.executionTime,
                        remark:'terrible'
                    };

                }else{
                    timeThresholdsSummary[tcTimeTest.id] = {
                        expectedTime: 0,
                        currentTime: tcTimeTest.executionTime,
                        remark:'unassigned or fd` up'
                    };
                }
            }
        }

        console.log(timeThresholdsSummary);

        return timeThresholdsSummary;
    } 
}