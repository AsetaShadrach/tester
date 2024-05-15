import { Field, Int, InputType, PartialType } from '@nestjs/graphql';
import {
  PermissionEffectGroup,
  PermissionScope,
  TenantType,
  TestAccountTypes,
  UserTypes,
} from '../enums/singeltonsE';
import { GraphQLBoolean, GraphQLString } from 'graphql';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

@InputType('PermissionInput')
export class PermissionInput {
  @IsNotEmpty()
  @Field()
  permission: string;

  @Field(() => GraphQLBoolean)
  isApproved: boolean;

  @Field(() => PermissionEffectGroup)
  permissionEffectGroup: PermissionEffectGroup;

  @Field(() => PermissionScope)
  permissionScope: PermissionScope;

  @IsNotEmpty()
  @Field()
  lastUpdatedBy: string;
}

@InputType('PermissionUpdateInput')
export class PermissionUpdateInput extends PartialType(PermissionInput) {}

@InputType('RoleInput')
export class RoleInput {
  @IsNotEmpty()
  @Field()
  role: string;

  @Field()
  canBePassedAsDefault: boolean;

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'If blank , will pass default permission',
  })
  permissions: string;

  @Field()
  isApproved: boolean;

  @IsNotEmpty()
  @Field()
  lastUpdatedBy: string;
}

@InputType('RoleUpdateInput')
export class RoleUpdateInput extends PartialType(RoleInput) {}

@InputType('TestAccountInput')
export class TestAccountInput {
  @IsNotEmpty()
  @Field()
  firstName: string;

  @IsNotEmpty()
  @Field()
  lastName: string;

  @IsEmail()
  @Field()
  email: string;

  @IsPhoneNumber()
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
  testAccountType: TestAccountTypes;

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'Comma seperated string of Role Ids',
  })
  role: string;

  @IsNotEmpty()
  @Field()
  lastUpdatedBy: string;
}

@InputType('TestAccountUpdateInput')
export class TestAccountUpdateInput extends PartialType(TestAccountInput) {}

@InputType('UserInput')
export class UserInput {
  @IsNotEmpty()
  @Field()
  firstName: string;

  @IsNotEmpty()
  @Field()
  lastName: string;

  @IsEmail()
  @Field()
  email: string;

  @Field(() => UserTypes)
  userType: UserTypes;

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'Comma seperated string of Role Ids',
  })
  role: string;

  @IsNotEmpty()
  @Field()
  lastUpdatedBy: string;
}

@InputType('UserUpdateInput')
export class UserUpdateInput extends PartialType(UserInput) {}

@InputType('TenantInput')
export class TenantInput {
  @IsNotEmpty()
  @Field()
  username: string;

  @IsNotEmpty()
  @Field()
  email: string;

  @IsNotEmpty()
  @Field(() => TenantType)
  tenantType: TenantType;

  @Field(() => GraphQLString, {
    nullable: true,
    description:
      'Comma seperated string of Ids of tenants this tenant belongs to',
  })
  parentTenants: string;

  @Field(() => GraphQLString, {
    nullable: true,
    description: 'Comma seperated string of Ids of sub tenants',
  })
  subTenants: string;

  @IsNotEmpty()
  @Field()
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
