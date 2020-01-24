import { Module, DynamicModule } from '@nestjs/common';
import { UserModule } from '../user';
import { DatabaseModule, DatabaseConnections } from '../database';
import { ArangoErrorFilter } from '../lib/ArangoError.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { OauthModule } from '../oauth';
import { RoomModule } from '../rooms';
import { OAuthGuard } from '../oauth/oauth.guard';

const resources = [
  OauthModule,
  UserModule,
  RoomModule,
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
        {
          provide: APP_GUARD,
          useClass: OAuthGuard
        }
      ],
    };
  }
}
