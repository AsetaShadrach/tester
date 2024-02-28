import { Field, ID, Int, ObjectType, createUnionType } from "@nestjs/graphql";
import { GraphQLString } from "graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TestCaseStatus } from "../enums/testCaseE";
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class RequestDetailsObject{
    @Field({description:'ID of the user initiating the test request'})
    initiatedBy:string; // In the case of groups the initiator might not be the one that created it
    @Field()
    url:string;
    @Field({nullable:true})
    requestType:string;
    @Field({nullable: true})
    bodyType:string; //Form,JSON,XML,text
    @Field(()=>[GraphQLString], {nullable: true})
    queryParams:Array<string>; // Array of key pairs
    @Field(()=>[GraphQLString], {nullable: true})
    bodyParams:Array<string>; // Array of key pairs
    @Field({nullable: true})
    reqText:string; //In the event the request can't fit in the other types
}

@ObjectType()
export class RequestHistoryObject{
    @Field({nullable: true})
    request:RequestDetailsObject;
    @Field(()=>[GraphQLString], {nullable: true})
    response:Array<string>; // Array of key pairs
    @Field({nullable: true})
    requestedAt:string;
    @Field({nullable: true})
    respondedAt:string;
}

@Entity('TestCase')
@ObjectType()
export class TestCase{
    @PrimaryGeneratedColumn('uuid')
    @Field(()=> ID)
    id: string;

    @Column({type:"varchar",name: 'test_case'})
    @Field()
    testCase:string;

    @Column({type:"varchar", name: 'created_by'})
    @Field()
    createdBy:string;

    @Column({type:"varchar", name: 'description'})
    @Field()
    description:string;

    @Column({type:'varchar', name: 'group_id', nullable: true})
    @Field({nullable:true})
    groupId: string; // You can group tests

    @Column({type:'varchar', name: 'test_type'})
    @Field({nullable:true})
    testType:string;

    @Column({type:'varchar', name: 'test_report_recipiernts', nullable: true})
    @Field(()=>GraphQLString, {nullable: true})
    testReportRecipients:string;

    @Column({type:'boolean', name:'retry_after_success', default:false})
    @Field(()=>Boolean, {nullable:true}) 
    retryAfterSuccess:boolean; 

    @Column({
        type:'enum', 
        name: 'status',
        enum: TestCaseStatus,
        default: TestCaseStatus.INITIATED})
    @Field({nullable:true})
    status:string;

    @Column({type:'int', name:'retry_max_attempts', default:0})
    @Field(()=>Int)
    retryMaxAttempts:number;

    @Column({type:'int', name:'retry_attempts', default:0})
    // Set to nullable but should always be updated to a value even in the case of a faliure
    @Field(()=>Int, {nullable:true})
    retryAttempts:number;

    @Column({type:'int', name:'retry_intervals', default:0})
    @Field(()=>Int)
    retryIntervals:number;

    @Column({type:'jsonb', name:'request_details'})
    @Field(()=>RequestDetailsObject)
    requestDetails:RequestDetailsObject;  // url, body, form, queryparams,

    // Only update request history if the request has been sent
    @Column({type:'jsonb', name:'request_history', nullable:true})
    @Field(()=>[RequestHistoryObject], {nullable: true})
    requestHistory:Array<RequestHistoryObject>; // Will contain the requestDetails and  finalResponseBody for every request

    @Column({type:'varchar', name:'last_updated_by', nullable:true})
    @Field({nullable:true})
    lastUpdatedBy:string

    @CreateDateColumn({type:'timestamptz', name:'created_at'})
    @Field()
    createdAt:Date;

    @UpdateDateColumn({type:"timestamptz", name:'updated_at'})
    @Field()
    updatedAt:Date;
}

@ObjectType()
export class GenericTypeObject{
    @Field(()=>Int, {nullable:true})
    httpStatus:number
    @Field({nullable:true})
    message:string
    @Field(()=>GraphQLJSON, {nullable:true})
    response: JSON;
    @Field({nullable:true},)
    responseDescription:string
    @Field(()=>[GraphQLJSON],{nullable:true})
    errors:Array<JSON>
}

@ObjectType('FilterTestCasesResponse')
export class FilterTestCasesResponse{
    @Field(()=>Int)
    count: number;

    @Field(()=>[TestCase])
    items:TestCase[];
}

export const TestCaseQueryResponse = createUnionType({
    name: 'TestCaseQueryResponse',
    types:()=> [GenericTypeObject, FilterTestCasesResponse] as const,
    resolveType(resp){
        if(resp.httpStatus){
            return GenericTypeObject;
        } else{
            return FilterTestCasesResponse;
        }
    },
});


export const TestCaseMutateResponse = createUnionType({
    name: 'TestCaseMutateResponse',
    types:()=> [TestCase , GenericTypeObject] as const,
    resolveType(resp){
        if(resp.httpStatus){
            return GenericTypeObject;
        } else {
            return TestCase;
        }
    },
});


export default class TestCaseEntities{
    TestCase = TestCase;
    GenericTypeObject = GenericTypeObject;
    RequestHistoryObject = RequestHistoryObject;
    RequestDetailsObject = RequestDetailsObject;
    FilterTestCasesResponse = FilterTestCasesResponse;
    TestCaseMutateResponse = TestCaseMutateResponse;
    TestCaseQueryResponse = TestCaseQueryResponse;
}