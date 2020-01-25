import { Module } from "@nestjs/common";
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from "path";
import { ASSETS_DIR } from "../../lib/constants";
import { WebShellGateway } from "./WebShell.gateway";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(ASSETS_DIR, 'static')
    })
  ],
  providers: [WebShellGateway]
})
export class WebShellModule {}