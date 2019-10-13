import Yargs from 'yargs-parser';
import { resolve } from 'path';

const envFile = Yargs(process.argv).config || resolve(__dirname, '../config.env');
require('dotenv').config({ path: envFile });

import { Emulator } from '../packages/core';
// import { WebShellModule } from '@orion/webshell';
import { BannerModule } from '../packages/banner';
import { OrionArangoModule } from '../packages/arangodb';

Emulator
  // .register(WebShellModule)
  .register(OrionArangoModule.configure())
  .register(BannerModule)
  .boot();
