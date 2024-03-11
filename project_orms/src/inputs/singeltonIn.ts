import { Field, Int, InputType, PartialType } from '@nestjs/graphql';
import { Permission, Role, Tenant } from '../entities/singeltons';
import { TestAccountTypes } from '../enums/singeltonsE';
import { GraphQLBoolean } from 'graphql';

@InputType('PermissionInput')
export class PermissionInput {
  @Field()
  permission: string;

  @Field(() => GraphQLBoolean)
  isApproved: boolean;

  @Field()
  permissionEffectGroup: string;

  @Field()
  permissionScope: string;

  @Field({ nullable: true })
  lastUpdatedBy: string;
}

@InputType('PermissionInput')
export class PermissionUpdateInput extends PartialType(PermissionInput) {}

@InputType('RoleInput')
export class RoleInput {
  @Field()
  role: string;

  @Field()
  canBePassedAsDefault: boolean;

  @Field(() => [Permission], { nullable: true })
  permissions: Permission[];

  @Field()
  isApproved: boolean;

  @Field({ nullable: true })
  lastUpdatedBy: string;
}

@InputType('RoleUpdateInput')
export class RoleUpdateInput extends PartialType(RoleInput) {}

@InputType('TestAccountInput')
export class TestAccountInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;

  @Field({ nullable: true })
  idNumber: string;

  @Field({ nullable: true })
  idNumberType: string;

  @Field({ nullable: true })
  taxDocumentPin: string;

  @Field({ nullable: true })
  taxDocumentPinType: string;

  @Field(() => Int)
  age: number;

  @Field(() => TestAccountTypes)
  testAccountType: string;

  @Field(() => Role)
  role: Role[];

  @Field({ nullable: true })
  lastUpdatedBy: string;
}

@InputType('TestAccountUpdateInput')
export class TestAccountUpdateInput extends PartialType(TestAccountInput) {}

@InputType('UserInput')
export class UserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(() => Role, { nullable: true })
  role: Role[];

  @Field({ nullable: true })
  lastUpdatedBy: string;
}

@InputType('UserUpdateInput')
export class UserUpdateInput extends PartialType(UserInput) {}

@InputType('TenantInput')
export class TenantInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  tenantType: string;

  @Field(() => Tenant)
  subTenants: Tenant[];

  @Field(() => Role)
  role: Role[];

  @Field({ nullable: true })
  lastUpdatedBy: string;
}

@InputType('TenantUpdateInput')
export class TenantUpdateInput extends PartialType(TenantInput) {}

export default class singeltonInputs {
  UserInput = UserInput;
  UserUpdateInput = UserUpdateInput;

  TestAccountInput = TestAccountInput;
  TestAccountUpdateInput = TestAccountUpdateInput;

  PermissionInput = PermissionInput;
  PermissionUpdateInput = PermissionUpdateInput;

  RoleInput = RoleInput;
  RoleUpdateInput = RoleUpdateInput;

  TenantInput = TenantInput;
  TenantUpdateInput = TenantUpdateInput;
}
