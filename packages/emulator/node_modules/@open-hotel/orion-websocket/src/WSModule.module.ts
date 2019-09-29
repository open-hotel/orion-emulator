import { Module, Global } from "@nestjs/common";
import { WSServer } from "./lib/WSServer.provider";

@Global()
@Module({
  providers: [WSServer],
  exports: [WSServer],
})
export class WSModule {}