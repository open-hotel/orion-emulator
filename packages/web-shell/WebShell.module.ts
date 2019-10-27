import { Module, Global } from '@nestjs/common'
// import { ShellModule } from '@orion/core'
// import { WSModule } from '@orion/websocket'
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path'
import { WebShellProvider } from './WebShell.provider';
import { ShellModule } from '../../src/core';

@Global()
@Module({
  imports: [
    ShellModule,
    // WSModule,
    ServeStaticModule.forRoot({
      renderPath: '/shell',
      rootPath: resolve(__dirname, '../public')
    })
  ],
  providers: [WebShellProvider],
  exports: [WebShellProvider],
})
export class WebShellModule {}