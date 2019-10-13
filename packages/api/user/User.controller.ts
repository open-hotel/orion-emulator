import { Post, Body, Controller } from "@nestjs/common";
import { UserService } from "./User.service";
import { UserRegisterDTO } from "./dto/UserRegister.dto";
import { ApiUseTags, ApiResponse } from "@nestjs/swagger";
import { UserDTO } from "./dto/User.dto";
import { UserIp } from "../../core/lib/UserIp.decorator";

@ApiUseTags('Users')
@Controller('users')
export class UserController {
  constructor (
    private readonly userService: UserService
  ) {}

  @Post()
  async getTicket (
    @Body() dto: UserRegisterDTO
  ) {

  }

  @ApiResponse({
    status: 201,
    type: UserDTO
  })
  @Post()
  async save (
    @Body() dto: UserRegisterDTO,
    @UserIp() ip: string
  ) {
    const user = new UserDTO({
      account: {
        email: dto.email,
        username: dto.username,
        password: dto.password,
        ip_reg: ip,
      },
      profile: {
        gender: dto.gender,
        birthday: new Date(dto.birthday),
      }
    })

    console.log(user)
    return this.userService.save(
      user
    )
  }
}