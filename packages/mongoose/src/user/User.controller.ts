import { Controller, Get, Post, Body } from "@nestjs/common";
import { UserService } from "./User.service";

@Controller('users')
export class UserController {
  constructor (
    private readonly service: UserService
  ) {}

  @Get()
  find () {
    return this.service.find()
  }

  @Post()
  save (@Body() data) {
    return new this.service.ModelConstructor(data).save()
  }
}