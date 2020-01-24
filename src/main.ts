import 'dotenv/config';
import { Emulator } from './core';
// import { WebShellModule } from '@orion/webshell';
import { BannerModule } from './core/banner';
import { OpenApiModule } from './api';
import { RoomModule } from './rooms';

Emulator
  // .register(WebShellModule)
  .register(OpenApiModule.configure())
  .register(BannerModule)
  .register(RoomModule)
  .boot();
