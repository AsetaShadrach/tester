import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permission } from 'project_orms/dist/entities/singeltons';
import { PermissionService } from './../services/permissions';
import {
  PermissionInput,
  PermissionUpdateInput,
} from 'project_orms/dist/inputs/singeltonIn';

@Resolver('Permissions')
export class PermissionsResolver {
  constructor(private permissionService: PermissionService) {}

  @Query(() => String)
  getHello() {
    // To fullfil query requirement for graphQL
    return 'Singeltons resolver is Up';
  }

  @Query(() => [String])
  getOptionValues(@Args('optionName') optionName: string) {
    return this.permissionService.getPermissionEnumVals(optionName);
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
