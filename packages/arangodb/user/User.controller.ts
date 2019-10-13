import { Post, Body, Controller } from "@nestjs/common";
import { UserService } from "./User.service";
import { IUser } from "./User.interface";

@Controller('users')
export class UserController {
  constructor (
    private readonly userService: UserService
  ) {}

  @Post()
  async save (@Body() dto: IUser) {
    return this.userService.save(dto)
  }
}