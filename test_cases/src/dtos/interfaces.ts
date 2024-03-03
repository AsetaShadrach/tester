export interface TestCase {
    id: string;
    testCase:string;
    createdBy:string;
    description:string;
    requestType:string;
    groupId?: string; // You can group tests
    testType:string;   
    status?:string;
    retryMaxAttempts?:number;
    retryAttempts?:number;
    retryIntervals?:number;
    requestDetails?:Object; // url, body, form, queryparams,
    requestHistory?:Object; // Will contain the requestDetails and  finalResponseBody for every request
    lastUpdatedBy?:string;
    createdAt:Date;
    updatedAt:Date;
}


export interface runConfigs{
    saveOption?: string, 
    testCaseId?: string,
    retryMaxAttempts?: number,
    retryIntervals?: number,
    parentId:string,
    groupId?:string,
    testType?:string,
    retryAfterSuccess?:boolean,
}