import Yargs from 'yargs';
import { resolve } from 'path';

const envFile = Yargs.parse().config || resolve(__dirname, '../config.env');
require('dotenv').config({ path: envFile });

import { Emulator } from '@open-hotel/orion-core';
import { WSModule } from '@open-hotel/orion-websocket';
import { WebShellModule } from '@open-hotel/orion-webshell';
import { BannerModule } from '@open-hotel/orion-banner';
import { OrionArangoModule } from '@open-hotel/orion-arangodb';

Emulator.register(WSModule)
  .register(WebShellModule)
  .register(OrionArangoModule.configure())
  .register(BannerModule)
  .boot();
