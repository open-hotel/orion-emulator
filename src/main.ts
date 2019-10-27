import Yargs from 'yargs';
import { resolve } from 'path';

const envFile = Yargs.parse().config || resolve(__dirname, '../../config.env');
require('dotenv').config({ path: envFile });

import { Emulator } from './core';
// import { WebShellModule } from '@orion/webshell';
import { BannerModule } from './banner';
import { OpenApiModule } from './api';
import { RoomModule } from './rooms';

Emulator
  // .register(WebShellModule)
  .register(OpenApiModule.configure())
  .register(BannerModule)
  .register(RoomModule)
  .boot();
