import { UserController } from "./User.controller";
import { UserService } from "./User.service";
import { OnModuleInit, Module } from "@nestjs/common";
import { Database } from "arangojs";
import { InjectArango } from "../lib/injectArango.decorator";

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements OnModuleInit {
  @InjectArango()
  private readonly db: Database

  async onModuleInit () {
    const users = this.db.collection('users')
    if (!await users.exists()) {
      await users.create()
    }
    if (!(await users.indexes()).includes('index_username')) {
      await users.createPersistentIndex('account.username', { unique: true })
    }
  }
}