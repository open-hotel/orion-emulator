import { Module, DynamicModule } from '@nestjs/common';
import { Database } from 'arangojs';
import { Config } from 'arangojs/lib/cjs/connection';
import { UserModule } from './user/User.module';
import { ModuleOptions } from './lib/ApiResourceMixin';
import { DatabaseModule } from './database/database.module';
import { ArangoErrorFilter } from './lib/ArangoError.filter';
import { APP_FILTER } from '@nestjs/core';

const modules = [
  UserModule
]

@Module({})
export class OpenApiModule {
  static configure(oprions?:ModuleOptions): DynamicModule {
    return {
      module: OpenApiModule,
      imports: [].concat(DatabaseModule, modules).map(mod => mod.configure(oprions)),
      providers: [
        {
          provide: APP_FILTER,
          useClass: ArangoErrorFilter,
        },
      ],
    };
  }
}
