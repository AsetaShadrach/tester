import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import {
  PermissionScope,
  PermissionEffectGroup,
  TestAccountTypes,
  TenantType,
} from '../enums/singeltonsE';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLString } from 'graphql';

@Entity('Permission')
@ObjectType('PermissionObject')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ name: 'permission', unique: true })
  @Field()
  permission: string;

  @Column({
    type: 'enum',
    name: 'permission_effect_group',
    enum: PermissionEffectGroup,
    default: PermissionEffectGroup.BASIC,
  })
  @Field(() => PermissionEffectGroup)
  permissionEffectGroup: PermissionEffectGroup;

  @Column({
    type: 'enum',
    name: 'permission_scope',
    enum: PermissionScope,
    default: PermissionScope.GENERAL,
  })
  @Field(() => PermissionScope)
  permissionScope: string;

  @Column({ type: 'boolean', default: false })
  @Field()
  isApproved: boolean;

  @Column({ type: 'jsonb', name: 'pending_update_json', nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  pendingUpdateJson: JSON;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  @Field()
  updatedAt: Date;

  @Column({ type: 'varchar', name: 'last_updated_by', nullable: true })
  @Field()
  lastUpdatedBy: string;
}

@Entity('Role')
@ObjectType('RoleObject')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ name: 'role', unique: true })
  @Field()
  role: string;

  /**
   * A role that you set as default can be passed
   * to an object on creation without requiring updates/approval etc.
   * E.g REGULAR_USER can be default but ADMIN_USER requires approval
   */
  @Column({ type: 'boolean', default: false })
  @Field()
  canBePassedAsDefault: boolean;

  @Column({ type: 'varchar' })
  @Field(() => GraphQLString, {
    description: 'Comma seperated string of IDs of permissions',
  })
  permissions: string;

  @Column({ type: 'boolean', default: false })
  @Field()
  isApproved: boolean;

  @Column({ type: 'jsonb', name: 'pending_update_json', nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  pendingUpdateJson: JSON;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  @Field()
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  @Field()
  lastUpdatedBy: string;
}

@Entity('TestAccount')
@Unique('UQ_TEST_ACC_DETAILS', ['email', 'phoneNumber', 'taxDocumentPin'])
@ObjectType('TestAccountObject')
export class TestAccount {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar', name: 'first_name' })
  @Field()
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name' })
  @Field()
  lastName: string;

  @Column({ type: 'varchar', name: 'email' })
  @Field()
  email: string;

  @Column({ type: 'varchar', name: 'phone_number' })
  @Field()
  phoneNumber: string;

  @Column({ type: 'varchar', name: 'id_number', nullable: true })
  @Field({ nullable: true })
  idNumber: string;

  @Column({ type: 'varchar', name: 'id_number_type', nullable: true })
  @Field({ nullable: true })
  idNumberType: string; // Foreign or local

  @Column({ type: 'varchar', name: 'tax_document_pin', nullable: true })
  @Field()
  taxDocumentPin: string;

  @Column({ type: 'varchar', name: 'tax_document_pin_type', nullable: true })
  @Field({ nullable: true })
  taxDocumentPinType: string; // Foreign or local

  @Column({ type: 'smallint', name: 'age' })
  @Field(() => Int)
  age: number;

  @Column({
    type: 'enum',
    name: 'test_account_type',
    enum: TestAccountTypes,
    default: TestAccountTypes.INDIVIDUAL,
  })
  @Field(() => TestAccountTypes)
  testAccountType: TestAccountTypes;

  @Column({ type: 'varchar' })
  @Field(() => GraphQLString, {
    description: 'Comma seperated string of IDs of roles',
  })
  role: string;

  @Column({ type: 'jsonb', name: 'pending_update_json', nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  pendingUpdateJson: JSON;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  @Field()
  updatedAt: Date;

  @Column({ type: 'varchar', name: 'last_updated_by', nullable: true })
  @Field()
  lastUpdatedBy: string;
}

@Entity('User')
@ObjectType('UserObject')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar', name: 'first_name' })
  @Field()
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name' })
  @Field()
  lastName: string;

  @Column({ type: 'varchar', unique: true })
  @Field()
  email: string;

  @Column({ type: 'varchar' })
  @Field(() => GraphQLString, {
    description: 'Comma seperated string of IDs of roles',
  })
  role: string;

  @Column({ type: 'jsonb', name: 'pending_update_json', nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  pendingUpdateJson: JSON;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  @Field()
  updatedAt: Date;

  @Column({ type: 'varchar', name: 'last_updated_by', nullable: true })
  @Field()
  lastUpdatedBy: string;
}

@Entity('Tenant')
@Unique('UQ_TENANT_DETAILS', ['username', 'email', 'tenantType'])
@ObjectType('TenantObject')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar', name: 'username' })
  @Field()
  username: string;

  @Column({ type: 'varchar' })
  @Field()
  email: string;

  @Column({
    type: 'enum',
    name: 'tenant_type',
    enum: TenantType,
    default: TenantType.INDIVIDUAL,
  })
  @Field(() => TenantType)
  tenantType: string;

  @Column({ type: 'varchar' })
  @Field(() => GraphQLString, {
    description:
      'Comma seperated string of IDs of parents tenants to this tenant',
  })
  parentTenants: string;

  @Column({ type: 'varchar' })
  @Field(() => GraphQLString, {
    description:
      'Comma seperated string of IDs of parents tenants to this tenant',
  })
  subTenants: string;

  @Column({ type: 'jsonb', name: 'pending_update_json', nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  pendingUpdateJson: JSON;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  @Field()
  updatedAt: Date;

  @Column({ type: 'varchar', name: 'last_updated_by', nullable: true })
  @Field()
  lastUpdatedBy: string;
}

export default class singeltonEntities {
  TestAccount = TestAccount;
  User = User;
  Role = Role;
  Permission = Permission;
  Tenant = Tenant;
}
