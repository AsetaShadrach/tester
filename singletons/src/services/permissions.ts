import { Permission } from 'project_orms/dist/entities/singeltons';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PermissionInput,
  PermissionUpdateInput,
} from 'project_orms/dist/inputs/singeltonIn';
import { composeSettingsFilterParams } from 'src/utils/queryUtils';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  getHello(): string {
    return 'Hello from PermissionService!';
  }

  async createPermission(params: PermissionInput) {
    return this.permissionRepository.save(params);
  }

  async updatePermission(id: string, params: PermissionUpdateInput) {
    return await this.permissionRepository.save({
      id: id,
      ...params,
    });
  }

  async filterPermissions(
    filterParams: any,
  ): Promise<{ items: Permission[]; count: number }> {
    let permissions: any;
    if (filterParams.params && filterParams.params.id) {
      // This section handles UUID types specifically i.e not VARCHAR
      permissions = await this.permissionRepository.findAndCountBy({
        id: filterParams.params.id,
      });
    } else {
      const filters = composeSettingsFilterParams(filterParams);
      permissions = await this.permissionRepository.findAndCount(filters);
    }

    return { items: permissions[0], count: permissions[0].length };
  }
}
