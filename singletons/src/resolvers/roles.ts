import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from 'project_orms/dist/entities/singeltons';
import { RoleService } from './../services/roles';
import {
  FilterRoleInput,
  RoleInput,
  RoleUpdateInput,
} from 'project_orms/dist/inputs/singeltonIn';
import GraphQLJSON from 'graphql-type-json';

@Resolver('Roles')
export class RolesResolver {
  constructor(private roleService: RoleService) {}

  @Mutation(() => Role)
  async createRole(@Args('roleCreationInput') roleCreationInput: RoleInput) {
    return await this.roleService.createRole(roleCreationInput);
  }

  @Mutation(() => Role)
  async updateRole(
    @Args('roleId') roleId: string,
    @Args('roleUpdateInput') roleUpdateInput: RoleUpdateInput,
  ) {
    return await this.roleService.updateRole(roleId, roleUpdateInput);
  }

  @Query(() => GraphQLJSON)
  async filterRoles(
    @Args('filterParams') filterParams: FilterRoleInput,
    @Args('page', { defaultValue: 1, nullable: true }) page: number,
    @Args('itemsPerPage', { defaultValue: 10, nullable: true })
    itemsPerPage: number,
    @Args('orderBy', { defaultValue: '', nullable: true }) orderBy: string,
  ) {
    const ftp = {
      params: filterParams,
      page: page,
      itemsPerPage: itemsPerPage,
      orderBy: orderBy,
    };
    return await this.roleService.filterRoles(ftp);
  }

}
