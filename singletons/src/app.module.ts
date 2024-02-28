import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TenantsResolver } from './resolvers/tenants';
import { TestAccountsResolver } from './resolvers/testAccounts';
import { UsersResolver } from './resolvers/users';
import { RolesResolver } from './resolvers/roles';
import { PermissionsResolver } from './resolvers/permissions';

import { TenantService } from './services/tenants';
import { TestAccountService } from './services/testAccount';
import { UserService } from './services/users';
import { RoleService } from './services/roles';
import { PermissionService } from './services/permissions';

import { TestAccount, Permission, Role, User, Tenant } from "project_orms/dist/entities/singeltons";
import { ConfigModule, ConfigService } from '@nestjs/config';
import path = require('path');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DATABASE'),
        // entities: [TestAccount, Permission, Role, User, Tenant],
        entities: [path.join(__dirname, '../node_modules/project_orms/dist/entities/singeltons{.ts,.js}')],
        synchronize: true,
      }),
    }),

    TypeOrmModule.forFeature([TestAccount, Permission, Role, User, Tenant]),
  ],
  providers: [
    // Services
    TenantService, TestAccountService, UserService, RoleService, PermissionService,
    
    // Resolvers
    TenantsResolver, TestAccountsResolver, UsersResolver, RolesResolver, PermissionsResolver,
  ],
})
export class AppModule {}
