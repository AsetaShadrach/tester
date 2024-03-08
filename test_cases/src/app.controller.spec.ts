import { Test, TestingModule } from '@nestjs/testing';
import { TestCaseMutationsResolver } from './resolvers/mutationResolver';
import { TestCaseMutationService } from './services/mutations';
import { RequestDetailsInput } from 'project_orms/dist/inputs/testCaseIn';

describe('AppController', () => {
  let testCaseMutationsResolver: TestCaseMutationsResolver;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TestCaseMutationsResolver],
      providers: [TestCaseMutationService],
    }).compile();

    testCaseMutationsResolver = app.get<TestCaseMutationsResolver>(
      TestCaseMutationsResolver,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(
        testCaseMutationsResolver.createTestCase({
          testCase: '',
          createdBy: '',
          description: '',
          parentId: '',
          groupId: '',
          testType: '',
          keysToMaskOnSave: [],
          runAndSave: '',
          testReportRecipients: '',
          retryAfterSuccess: false,
          status: '',
          retryMaxAttempts: 0,
          retryIntervals: 0,
          requestDetails: new RequestDetailsInput(),
        }),
      ).toBe('Hello World!');
    });
  });
});
