import { User } from 'project_orms/dist/entities/singeltons';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserInput,
  UserUpdateInput,
} from 'project_orms/dist/inputs/singeltonIn';
import { composeUserTenantFilterParams } from 'src/utils/queryUtils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  getHello(): string {
    return 'Hello from UserService!';
  }

  async createUser(params: UserInput) {
    return await this.userRepository.save(params);
  }

  async updateUser(id: string, params: UserUpdateInput) {
    return await this.userRepository.save({
      id: id,
      ...params,
    });
  }

  async filterUsers(
    filterParams: any,
  ): Promise<{ items: User[]; count: number }> {
    let users: any;

    if (filterParams.params && filterParams.params.id) {
      // This section handles UUID types specifically i.e not VARCHAR
      users = await this.userRepository.findAndCountBy({
        id: filterParams.params.id,
      });
    } else {
      const filters = composeUserTenantFilterParams(filterParams);
      users = await this.userRepository.findAndCount(filters);
    }

    return { items: users[0], count: users[0].length };
  }
}
