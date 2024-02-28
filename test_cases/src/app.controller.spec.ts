import { Test, TestingModule } from '@nestjs/testing';
import { TestCaseResolver } from './resolvers/mutationResolver';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: TestCaseResolver;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TestCaseResolver],
      providers: [AppService],
    }).compile();

    appController = app.get<TestCaseResolver>(TestCaseResolver);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.createCase()).toBe('Hello World!');
    });
  });
});
