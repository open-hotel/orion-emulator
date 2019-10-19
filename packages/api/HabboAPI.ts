import { Module, DynamicModule } from '@nestjs/common';
import { Database } from 'arangojs';
import { Config } from 'arangojs/lib/cjs/connection';
import { UserModule } from './user/User.module';
import { DatabaseModule, DatabaseConnections } from './database/database.module';
import { ArangoErrorFilter } from './lib/ArangoError.filter';
import { APP_FILTER } from '@nestjs/core';
import { OauthModule } from './oauth/oauth.module';

const resources = [
  UserModule,
  OauthModule
]

@Module({})
export class OpenApiModule {
  static configure(databases?:DatabaseConnections): DynamicModule {
    return {
      module: OpenApiModule,
      imports: [
        DatabaseModule.configure(databases),
        ...resources
      ],
      providers: [
        {
          provide: APP_FILTER,
          useClass: ArangoErrorFilter,
        },
      ],
    };
  }
}
