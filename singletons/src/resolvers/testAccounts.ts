import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TestAccount } from 'project_orms/dist/entities/singeltons';
import { TestAccountService } from './../services/testAccount';
import {
  TestAccountInput,
  TestAccountUpdateInput,
} from 'project_orms/dist/inputs/singeltonIn';

@Resolver('TestAccounts')
export class TestAccountsResolver {
  constructor(private testAccountService: TestAccountService) {}

  @Mutation(() => TestAccount)
  async createTestAccount(
    @Args('testAccountCreationInput')
    testAccountCreationInput: TestAccountInput,
  ) {
    return await this.testAccountService.createTestAccount(
      testAccountCreationInput,
    );
  }

  @Mutation(() => TestAccount)
  async updateTenant(
    @Args('testAccountId') testAccountId: string,
    @Args('testAccountUpdateInput')
    testAccountUpdateInput: TestAccountUpdateInput,
  ) {
    return await this.testAccountService.updateTestAccount(
      testAccountId,
      testAccountUpdateInput,
    );
  }
}
