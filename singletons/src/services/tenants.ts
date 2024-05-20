import { Tenant } from 'project_orms/dist/entities/singeltons';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TenantInput,
  TenantUpdateInput,
} from 'project_orms/dist/inputs/singeltonIn';
import { composeUserTenantFilterParams } from 'src/utils/queryUtils';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant) private tenantRepository: Repository<Tenant>,
  ) {}
  getHello(): string {
    return 'Hello from TenantService!';
  }

  async createTenant(params: TenantInput) {
    return this.tenantRepository.save(params);
  }

  async updateTenant(id: string, params: TenantUpdateInput) {
    return await this.tenantRepository.save({
      id: id,
      ...params,
    });
  }

  async filterTestAccounts(
    filterParams: any,
  ): Promise<{ items: Tenant[]; count: number }> {
    let tenants: any;

    if (filterParams.params && filterParams.params.id) {
      // This section handles UUID types specifically i.e not VARCHAR
      tenants = await this.tenantRepository.findAndCountBy({
        id: filterParams.params.id,
      });
    } else {
      const filters = composeUserTenantFilterParams(filterParams);
      tenants = await this.tenantRepository.findAndCount(filters);
    }

    return { items: tenants[0], count: tenants[0].length };
  }
}
