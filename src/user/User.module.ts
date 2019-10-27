import { UserController } from "./User.controller";
import { UserService } from "./User.service";
import { OnModuleInit, Module } from "@nestjs/common";
import { Database } from "arangojs";
import { InjectArango } from "../lib/injectArango.decorator";
import { CreateIfNotExists } from "../lib/ArangoDDL";
import { UserDTO } from "./dto/User.dto";

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements OnModuleInit {
  @InjectArango()
  private readonly db: Database

  async onModuleInit () {
    const users = this.db.collection<UserDTO>('users')
    await CreateIfNotExists.collection(users)
    await CreateIfNotExists.uniqueIndex(users, 'index_username', 'account.username')
  }
}