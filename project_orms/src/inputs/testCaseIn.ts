import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { TestCaseRunOption } from '../enums/testCaseE';

@InputType('RequestDetailsInput')
export class RequestDetailsInput {
  @Field(() => GraphQLString, {
    description: 'ID of the user initiating the test request',
  })
  initiatedBy: string; // In the case of groups the initiator might not be the one that created it
  @Field(() => GraphQLString, { description: 'URL to send the request to' })
  url: string;
  @Field(() => GraphQLString, {
    nullable: true,
    description: 'Sets method to use in the request e.g get or post',
  })
  requestType: string;
  @Field(() => [GraphQLString], {
    nullable: true,
    description: 'List of Key:value strings in the list of query parameters',
  })
  queryParams: Array<string>; // Array of key pairs
  @Field(() => [GraphQLString], {
    nullable: true,
    description: 'List of Key:value strings in the list of body parameters',
  })
  bodyParams: Array<string>; // Array of key pairs
  @Field(() => [GraphQLString], {
    nullable: true,
    description: 'List of Key:value strings in the list of header parameters',
  })
  headerParams: Array<string>; // Array of key pairs
  @Field(() => GraphQLString, {
    nullable: true,
    description:
      'String containing request data that was not passed as a bodyParam or queryParam',
  })
  reqText: string; // In the event the request can't fit in the other types
}

@InputType('RequestDetailsFilter')
export class RequestDetailsFilter {
  @Field(() => GraphQLString, {
    nullable: true,
    description: 'filters for ID of the user that initiated the test request',
  })
  initiatedBy: string; // In the case of groups the initiator might not be the one that created it

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'filters for URL where requests were/was sent to',
  })
  url: string;

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'filters for method used in the request e.g get or post',
  })
  requestType: string;

  @Field(() => GraphQLString, {
    nullable: true,
    description:
      'filters for format of the request body e.g x-www-form-urlencoded, json etc',
  })
  bodyType: string; //Form,JSON,XML,text

  @Field(() => GraphQLString, {
    nullable: true,
    description:
      'filters for key:value string in the list of query parameters.',
  })
  queryParam: string; // Searches the list of query param key:value pairs

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'filters for key:value string in the list of body parameters',
  })
  bodyParams: string; // Searches the list of query param key:value pairs

  @Field(() => GraphQLString, {
    nullable: true,
    description:
      'filters for string in the string containing reqText that was not passed as a bodyParam or queryParam',
  })
  reqText: string; // In the event the request can't fit in the other types (e.g xml)
}

@InputType('TestCaseInput')
export class TestCaseInput {
  @Field(() => GraphQLString, {
    description: 'unique user defined name for your test case',
  })
  testCase: string;

  @Field(() => GraphQLString, {
    description: 'ID of user that created the test case',
  })
  createdBy: string;

  @Field(() => GraphQLString, {
    description: 'brief description of your test case',
  })
  description: string;

  @Field(() => GraphQLString, {
    nullable: true,
    description:
      'ID of the initial request where you want to chain/add the response of the current request to',
  })
  parentId: string; // You can group tests

  @Field(() => GraphQLString, {
    nullable: true,
    description:
      'Unique ID/name for test cases you want to group together. By passing name/ID here, ' +
      'you effectively bundle the test case together with all other test cases sharing that group ID',
  })
  groupId: string; // You can group tests

  @Field(() => GraphQLString, {
    description: '"Topic of the test case" e.g UserCreation, TransactionRecon',
  })
  testType: string;

  @Field(() => [GraphQLString], {
    nullable: true,
    description:
      'If not empty , all mentioned keys will be masked if test case is saved',
  })
  keysToMaskOnSave: Array<string>;

  @Field(() => GraphQLString, {
    name: 'runAndSave',
    defaultValue: TestCaseRunOption.RUN_ONLY,
    nullable: true,
    description: 'Specifies what to do with the request when executed',
  })
  runAndSave: string;

  @Field(() => GraphQLString, {
    nullable: true,
    description:
      'Comma seperated string of emails. If specified, the emails in this string will recieve a report as per the specifications provided for the test case',
  })
  testReportRecipients: string;

  @Field(() => Boolean, {
    defaultValue: false,
    description:
      'Set to true if you want an iterative rerun of the test request evn after success',
  })
  retryAfterSuccess: boolean; // For robust testing e.g best of 3 ?

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'Status of the current test case',
  })
  status: string;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 1,
    description:
      'Number of times to retry the request(Will only retry successfull test cases if `retryAfterSuccess` is set to true )',
  })
  retryMaxAttempts: number;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 0,
    description: 'Duration to wait before retrying the test case (in seconds)',
  })
  retryIntervals: number;

  @Field(() => RequestDetailsInput, {
    nullable: true,
    description: 'Contains details of the request to be run in the test case',
  })
  requestDetails: RequestDetailsInput; // url, body, form, queryparams,
  // Set as a seperate column to allow somone to edit a request before the next run , they can eddit a request and run or schedule a run
  //  Scheduled_for  ?? Columns
}

@InputType('TestCaseUpdateInput')
export class TestCaseUpdateInput extends PartialType(TestCaseInput) {}

// Filter inputs fro Test Cases
@InputType('TestCaseFilter')
export class TestCaseFilter {
  @Field(() => GraphQLString, {
    nullable: true,
    description: 'filter for IDs of the tes cases',
  })
  id: string;

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'filter for string in name for your test case',
  })
  testCase: string;

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'filter for ID of user that created the test case',
  })
  createdBy: string;

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'filter for string in description',
  })
  description: string;

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'filter for group names/IDs for test cases',
  })
  groupId: string; // You can group tests

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'filter for test type e.g User Creation, Transactoin Recon',
  })
  testType: string;

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'filter for run and save options',
  })
  runAndSave: string;

  // This could be computationally heavy consider validating for a time constraint on the same
  @Field(() => GraphQLString, {
    nullable: true,
    description:
      'filters list of report recipients, checks if if string is found',
  })
  testReportRecipients: string;

  @Field(() => Boolean, {
    nullable: true,
    description: 'filters for those set to retryAfterSuccess or not',
  })
  retryAfterSuccess: boolean; // For robust testing e.g best of 3 ?

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'filters for test case status',
  })
  status: string;

  @Field(() => Int, {
    nullable: true,
    description:
      'filters for any max attempts set to less than or equal to the value here',
  })
  retryMaxAttemptsUpperLimit: number;

  @Field(() => Int, {
    nullable: true,
    description:
      'filters for any max attempts set to more than or equal to the value here',
  })
  retryMaxAttemptsLowerLimit: number;

  @Field(() => Int, {
    nullable: true,
    description:
      'filters for any retry attempts that were less than or equal to the value here',
  })
  retryAttemptsUpperLimit: number;

  @Field(() => Int, {
    nullable: true,
    description:
      'filters for any retry attempts that were more than or equal to the value here',
  })
  retryAttemptsLowerLimit: number;

  @Field(() => Int, {
    nullable: true,
    description:
      'filters for any retry intervals set to less than or equal to the value here',
  })
  retryIntervalsUpperLimit: number;

  @Field(() => Int, {
    nullable: true,
    description:
      'filters for any retry intervals set to more than or equal to the value here',
  })
  retryIntervalsLowerLimit: number;

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'filters for update dates equal-to/less than the date entered',
  })
  updatedAtUpperLimit: string;

  @Field(() => GraphQLString, {
    nullable: true,
    description:
      'filters for update dates equal-to/more/greater than the date entered',
  })
  updatedAtLowerLimit: string;

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'filters for create dates equal-to/less than the date entered',
  })
  createdAtUpperLimit: string;

  @Field(() => GraphQLString, {
    nullable: true,
    description:
      'filters for create dates equal-to/more/greater than the date entered',
  })
  createdAtLowerLimit: string;

  @Field(() => RequestDetailsFilter, {
    nullable: true,
    description: 'filters for request details as per specification',
  })
  requestDetails: RequestDetailsFilter;
}

@InputType('FilterTestCasesParams')
export class FilterTestCasesParams {
  @Field(() => Int)
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  itemsPerPage: number;

  @Field({ nullable: true })
  orderBy: string;

  @Field({
    nullable: true,
    description:
      'asc or desc, default is desc if a value to order by has been set',
  })
  order: string;

  @Field(() => TestCaseFilter, { nullable: true })
  params: TestCaseFilter;
}

export default class TestCaseInputs {
  TestCaseFilter = TestCaseFilter;
  TestCaseInput = TestCaseInput;
  TestCaseUpdateInput = TestCaseUpdateInput;
  RequestDetailsInput = RequestDetailsInput;
  RequestDetailsFilter = RequestDetailsFilter;
  FilterTestCasesParams = FilterTestCasesParams;
}
