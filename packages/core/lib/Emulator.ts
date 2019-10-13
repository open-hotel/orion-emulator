import { NestApplication, NestFactory, Reflector } from "@nestjs/core"
import { DynamicModule, Module, Type, ForwardReference, Global, ValidationPipe, ClassSerializerInterceptor } from "@nestjs/common"
import { ShellModule } from "../shell"
import { EventsProvider } from "./Events.provider"
import { getApp, setApp } from "./nest.app"
import helmet from 'helmet'
import RateLimiter from 'express-rate-limit'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

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

    app.useGlobalPipes(new ValidationPipe({
      validationError: {
        target: false
      },
      whitelist: true
    }));
    
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

    app.use(RateLimiter({
      windowMs: 60 * 1000, // 1 minute
      max: 30, // limit each IP to 30 requests per windowMs
    }))

    app.use(helmet())
    
    this.setupSwagger(app)
    
    app.init()
    setApp(app)
  }

  private static async setupSwagger (app:NestApplication) {
    const options = new DocumentBuilder()
      .setTitle('Open Hotel API')
      .setDescription('Orion API')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }
}

// @ts-ignore
global.__ORION__ = Emulator