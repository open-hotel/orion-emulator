import { Module, DynamicModule } from '@nestjs/common';
import { Database } from 'arangojs';
import { Config } from 'arangojs/lib/cjs/connection';
import { UserService } from './user/User.service';
import { UserController } from './user/User.controller';

interface Options {
  connectionName?: string,
  options?: Config;
  url?: string;
  database?: string;
  user?: string;
  password?: string;
}

const services = [
  UserService
]

@Module({})
export class OrionArangoModule {
  static configure({
    options = {},
    connectionName = 'default',
    url = process.env.ARANGODB_URI,
    database = process.env.ARANGODB_DATABASE,
    user = process.env.ARANGODB_USER,
    password = process.env.ARANGODB_PASSWORD,
  }: Options = {}): DynamicModule {
    const DB = new Database({
      url,
      ...options as Object
    });

    console.log(url, database, password)

    DB.useDatabase(database);
    DB.useBasicAuth(user, password);

    return {
      module: OrionArangoModule,
      controllers: [UserController],
      providers: [
        {
          provide: `ARANGO_DB#${connectionName}`,
          useValue: DB,
        },
        ...services
      ],
    };
  }
}
