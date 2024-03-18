export interface TestCase {
  id: string;
  testCase: string;
  createdBy: string;
  description: string;
  requestType: string;
  groupId?: string; // You can group tests
  testType: string;
  status?: string;
  retryMaxAttempts?: number;
  retryAttempts?: number;
  retryIntervals?: number;
  requestDetails?: object; // url, body, form, queryparams,
  requestHistory?: object; // Will contain the requestDetails and  finalResponseBody for every request
  lastUpdatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface runConfigs {
  runAndSave?: string;
  retryMaxAttempts?: number;
  retryIntervals?: number;
  parentId?: string; // Will also hold as the testCaseID
  groupId?: string;
  testType?: string;
  retryAfterSuccess?: boolean;
}
