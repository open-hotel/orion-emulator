import Yargs from 'yargs';
import { resolve } from 'path';

const envFile = Yargs.parse().config || resolve(__dirname, '../../config.env');
require('dotenv').config({ path: envFile });


console.log(envFile)
import { Emulator } from '../packages/core';
// import { WebShellModule } from '@orion/webshell';
import { BannerModule } from '../packages/banner';
import { OpenApiModule } from '../packages/api';
import { RoomModule } from '../packages/rooms/Room.module';

Emulator
  // .register(WebShellModule)
  .register(OpenApiModule.configure())
  .register(BannerModule)
  .register(RoomModule)
  .boot();
