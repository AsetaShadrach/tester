import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permission } from 'project_orms/dist/entities/singeltons';
import { PermissionService } from './../services/permissions';
import {
  FilterPermissionInput,
  PermissionInput,
  PermissionUpdateInput,
} from 'project_orms/dist/inputs/singeltonIn';
import GraphQLJSON from 'graphql-type-json';

@Resolver('Permissions')
export class PermissionsResolver {
  constructor(private permissionService: PermissionService) {}

  @Query(() => String)
  getHello() {
    // To fullfil query requirement for graphQL
    return 'Singeltons resolver is Up';
  }

  @Query(() => GraphQLJSON)
  async filterPermissions(
    @Args('filterParams') filterParams: FilterPermissionInput,
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
    return await this.permissionService.filterPermissions(ftp);
  }

  @Mutation(() => Permission)
  async createPermission(
    @Args('permissionCreationInput') permissionCreationInput: PermissionInput,
  ) {
    return await this.permissionService.createPermission(
      permissionCreationInput,
    );
  }

  @Mutation(() => Permission)
  async updatePermission(
    @Args('permissionId') permissionId: string,
    @Args('permissionUpdateInput') permissionUpdateInput: PermissionUpdateInput,
  ) {
    return await this.permissionService.updatePermission(
      permissionId,
      permissionUpdateInput,
    );
  }
}
