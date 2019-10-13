import { ModuleMetadata, DynamicModule } from "@nestjs/common/interfaces";

export interface NestModuleOptions {
  controllers?: boolean,
  providers?: boolean,
}

export type ModuleOptions = NestModuleOptions | Record<string, NestModuleOptions>

export function ApiResourceMixin (metadata: ModuleMetadata = {}, key?) {
  return class {
    static configure (opts: ModuleOptions = {
      controllers: true,
      providers: true
    }): DynamicModule {
      key = key || this.name
      return {
        module: this,
        controllers: opts.controllers || opts[key].controllers ? metadata.controllers : [],
        providers: opts.providers || opts[key].providers ? metadata.providers : [],
        exports: metadata.exports
      }
    }
  }
}