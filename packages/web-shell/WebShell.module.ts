import { Module, Global } from '@nestjs/common'
// import { ShellModule } from '@open-hotel/orion-core'
// import { WSModule } from '@open-hotel/orion-websocket'
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path'
import { WebShellProvider } from './WebShell.provider';
import { ShellModule } from '@open-hotel/orion-core';

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