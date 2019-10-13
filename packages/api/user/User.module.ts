import { ApiResourceMixin } from "../lib/ApiResourceMixin";
import { UserController } from "./User.controller";
import { UserService } from "./User.service";

export class UserModule extends ApiResourceMixin({
  controllers: [UserController],
  providers: [UserService]
}) {}