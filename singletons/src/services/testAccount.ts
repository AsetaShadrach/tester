import { TestAccount } from 'project_orms/dist/entities/singeltons';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TestAccountInput,
  TestAccountUpdateInput,
} from 'project_orms/dist/inputs/singeltonIn';
import { composeFilterParams } from 'src/utils/queryUtils';

@Injectable()
export class TestAccountService {
  constructor(
    @InjectRepository(TestAccount)
    private testAccountRepository: Repository<TestAccount>,
  ) {}
  getHello(): string {
    return 'Hello from TestAccountService!';
  }

  async createTestAccount(params: TestAccountInput) {
    return this.testAccountRepository.save(params);
  }

  async updateTestAccount(id: string, params: TestAccountUpdateInput) {
    return await this.testAccountRepository.save({
      id: id,
      ...params,
    });
  }

  async filterTestAccounts(
    filterParams: any,
  ): Promise<{ items: TestAccount[]; count: number }> {
    let tAs: any;

    if (filterParams.params && filterParams.params.id) {
      // This section handles UUID types specifically i.e not VARCHAR
      tAs = await this.testAccountRepository.findAndCountBy({
        id: filterParams.params.id,
      });
    } else {
      const filters = composeFilterParams(filterParams);
      tAs = await this.testAccountRepository.findAndCount(filters);
    }

    return { items: tAs[0], count: tAs[0].length };
  }
}
