import 'dotenv/config';
import { Emulator } from './core';
import { BannerModule } from './core/banner';
import { OpenApiModule } from './api';
import { RoomModule } from './rooms';
import { WebShellModule } from './core/shell/webshell/WebShell.module';

Emulator
  .register(WebShellModule)
  .register(OpenApiModule.configure())
  .register(BannerModule)
  .register(RoomModule)
  .boot();
