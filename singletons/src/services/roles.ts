import { TestAccount, Permission, Role, User, Tenant } from "project_orms/dist/entities/singeltons";

import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleInput, RoleUpdateInput, } from "project_orms/dist/inputs/singeltonIn";
import { composeFilterParams } from "src/utils/queryUtils";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role) private roleRepository: Repository<Role>,
    ){}
  getHello(): string {
    return 'Hello from RoleService!';
  }

  async createRole(params: RoleInput) {
    return this.roleRepository.save(params)    
  }

  async updateRole(id: string, params:RoleUpdateInput) {
    return await this.roleRepository.save({
        id: id,
        ...params
    })
  }


  async filterRoles(filterParams:any):Promise<{items:Permission[],count:number}>{
    let users:any;
    
    if(filterParams.params && filterParams.params.id){
      // This section handles UUID types specifically i.e not VARCHAR
      users = await this.roleRepository.findAndCountBy({id:filterParams.params.id})
    }else{
      const filters = composeFilterParams(filterParams);
      users = await this.roleRepository.findAndCount(filters)
    }
  
    return {items:users[0], count:users[0].length}
  }
}