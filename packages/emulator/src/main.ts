import { Emulator } from '@open-hotel/orion-core'
import { WSModule } from '@open-hotel/orion-websocket'
import { resolve } from 'path'
import Yargs from 'yargs'
import { WebShellModule } from '@open-hotel/orion-webshell'

const envFile = Yargs.parse().config || resolve(__dirname, '../config.env')
require('dotenv').config({ path: envFile })

Emulator
  .register(WSModule)
  .register(WebShellModule)
  .boot()