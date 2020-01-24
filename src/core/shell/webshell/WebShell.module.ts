import { Module } from "@nestjs/common";
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from "path";
import { ASSETS_DIR } from "../../lib/constants";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(ASSETS_DIR, 'static')
    })
  ]
})
export class WebShellModule {}