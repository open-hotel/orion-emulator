import { Module, Global, DynamicModule, Provider } from "@nestjs/common";
import { Database } from "arangojs";
import { Config } from "arangojs/lib/cjs/connection";

interface DatabaseConnection {
  options?: Config,
  url: string,
  database: string,
  user: string,
  password: string
}

type DatabaseConnections = Record<string,DatabaseConnection>

interface DatabaseModuleOptions {
  database: DatabaseConnections
}

@Global()
@Module({})
export class DatabaseModule {
  static configure ({ database }: DatabaseModuleOptions = {
    database: {
      default: {
        database: process.env.ARANGODB_DATABASE,
        url: process.env.ARANGODB_URL,
        user: process.env.ARANGODB_USER,
        password: process.env.ARANGODB_PASSWORD,
      }
    }
  }) : DynamicModule {
    const databases = Object.keys(database).map<Provider>(name => {
      const { url, database: db, options = {}, password, user } = database[name]
      
      return {
        provide: `ARANGO_DB#${name}`,
        useFactory: async () => {
          const DB = new Database({
            url,
            ...options as Object
          });

          DB.useBasicAuth(user, password);
          if (!(await DB.listDatabases()).includes(db)) {
            await DB.createDatabase(db)
          }

          DB.useDatabase(db)
          
          return DB
        }
      }
    })

    return {
      module: this,
      providers: databases,
      exports: databases
    }
  }
}