import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TimeAggregations } from './services/timeAggregation';
import { TestCase } from 'project_orms/dist/entities/testCases';
import * as path from 'path';

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
  ],

  controllers: [AppController],
  providers: [AppService, TimeAggregations],
})
export class AppModule {}
