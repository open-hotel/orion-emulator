import { NestApplication, NestFactory } from '@nestjs/core';
import {
  DynamicModule,
  Module,
  Type,
  ForwardReference,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ShellModule } from '../shell';
import { EventsProvider } from './Events.provider';
import { getApp, setApp } from './nest.app';
import helmet from 'helmet';
import cors from 'cors';
import RateLimiter from 'express-rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WSAdapter } from '../../lib/WsAdapter';

@Module({})
export class Emulator {
  static mainModule: DynamicModule = {
    imports: [ShellModule],
    providers: [
      EventsProvider,
      {
        provide: APP_INTERCEPTOR,
        useClass: ClassSerializerInterceptor
      },
    ],
    exports: [EventsProvider],
    module: Emulator,
  };

  static register(
    plugin:
      | Type<any>
      | DynamicModule
      | Promise<DynamicModule>
      | ForwardReference,
  ) {
    this.mainModule.imports.push(plugin);
    return this;
  }

  static async boot() {
    let app = getApp();

    if (app) return null;

    app = await NestFactory.create(this.mainModule);

    app.useWebSocketAdapter(new WSAdapter(app));
    app.use(cors());

    app.useGlobalPipes(
      new ValidationPipe({
        validationError: {
          target: false,
        },
        whitelist: true,
      }),
    );

    app.use(
      RateLimiter({
        windowMs: 60 * 1000, // 1 minute
        max: 70, // limit each IP to 30 requests per windowMs
      }),
    );

    app.use(helmet());

    this.setupSwagger(app);

    app.init();

    setApp(app);
  }

  private static async setupSwagger(app: NestApplication) {
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
global.__ORION__ = Emulator;
