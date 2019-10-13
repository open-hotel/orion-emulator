import { NestApplication, NestFactory } from "@nestjs/core"
import { DynamicModule, Module, Type, ForwardReference, Global } from "@nestjs/common"
import { ShellModule } from "../shell"
import { EventsProvider } from "./Events.provider"
import { getApp, setApp } from "./nest.app"

@Global()
@Module({})
export class Emulator {  
  static mainModule: DynamicModule = {
    imports: [ShellModule],
    providers: [EventsProvider],
    exports: [EventsProvider],
    module: Emulator
  }

  static register (plugin: Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference) {
    this.mainModule.imports.push(plugin)
    return this
  }

  static async boot () {
    let app = getApp()
    if (app) return null
    app = await NestFactory.create(this.mainModule)
    app.init()
    setApp(app)
  }
}

// @ts-ignore
global.__ORION__ = Emulator