import { UserController } from "./User.controller";
import { UserService } from "./User.service";
import { OnModuleInit, Module } from "@nestjs/common";
import { Database } from "arangojs";
import { InjectArango } from "../lib/injectArango.decorator";
import { CreateIfNotExists } from "../lib/ArangoDDL";
import { UserDTO } from "./dto/User.dto";
import { RoomModule } from "../rooms";

@Module({
  imports: [RoomModule],
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
    await CreateIfNotExists.uniqueIndex(users, 'index_auth_ticket', 'auth_ticket')
  }
}