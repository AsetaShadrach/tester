import { Inject } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Role } from "project_orms/dist/entities/singeltons";
import { RoleService } from "./../services/roles";
import { RoleInput, RoleUpdateInput } from "project_orms/dist/inputs/singeltonIn";


@Resolver('Roles')
export class RolesResolver{
    constructor(
        private roleService: RoleService,
    ){}

    @Mutation(()=>Role)
    async createRole(
        @Args('roleCreationInput') roleCreationInput: RoleInput)
        {
        return await this.roleService.createRole(roleCreationInput);      
    }

    @Mutation(()=>Role)
    async updateRole(
        @Args('roleId') roleId:string,
        @Args('roleUpdateInput') roleUpdateInput: RoleUpdateInput)
        {
        return await this.roleService.updateRole(roleId, roleUpdateInput);      
    }    
}

