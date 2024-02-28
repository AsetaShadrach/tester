import { TestAccount, Permission, Role, User, Tenant } from "project_orms/dist/entities/singeltons";

import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PermissionInput, PermissionUpdateInput, } from "project_orms/dist/inputs/singeltonIn";
import { composeFilterParams } from "src/utils/queryUtils";

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
    ){}
  getHello(): string {
    return 'Hello from PermissionService!';
  }

  async createPermission(params: PermissionInput) {
    return this.permissionRepository.save(params)    
  }

  async updatePermission(id: string, params:PermissionUpdateInput) {
    return await this.permissionRepository.save({
        id: id,
        ...params
    })
  }


  async filterPermissions(filterParams:any):Promise<{items:Permission[],count:number}>{
    let users:any;
    
    if(filterParams.params && filterParams.params.id){
      // This section handles UUID types specifically i.e not VARCHAR
      users = await this.permissionRepository.findAndCountBy({id:filterParams.params.id})
    }else{
      const filters = composeFilterParams(filterParams);
      users = await this.permissionRepository.findAndCount(filters)
    }
  
    return {items:users[0], count:users[0].length}
  }
}