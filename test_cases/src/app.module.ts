import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TestCaseQueryResolver } from './resolvers/queryResolver';
import { TestCaseMutationsResolver } from './resolvers/mutationResolver';
import { TestCaseMutationService } from './services/mutations';
import { TestCaseQueryService } from './services/queries';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCase } from 'project_orms/dist/entities/testCases';
import { TcRequestService } from './utils/execReqUtils';
import { HttpModule } from '@nestjs/axios';
import * as path from 'path';
import { E2EProcessResolver } from './resolvers/e2eResolvers';
import { E2EProcessService } from './services/processGroupReqUtils.';

@Module({
  imports: [
    HttpModule,
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
        entities: [
          path.join(
            __dirname,
            '../node_modules/project_orms/dist/entities/testCases{.ts,.js}',
          ),
        ],
        synchronize: true,
      }),
    }),

    TypeOrmModule.forFeature([TestCase]),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      path: '/test-case',
    }),
  ],
  providers: [
    // Services
    TestCaseMutationService,
    TestCaseQueryService,
    TcRequestService,
    E2EProcessService,

    // Resolvers
    TestCaseMutationsResolver,
    TestCaseQueryResolver,
    E2EProcessResolver,
  ],
})
export class AppModule {}
