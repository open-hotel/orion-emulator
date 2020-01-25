import {
  Post,
  Body,
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { UserService } from './User.service';
import { UserRegisterDTO } from './dto/UserRegister.dto';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { UserDTO } from './dto/User.dto';
import { UserIp } from '../core/lib';
import { RoomService } from '../rooms/RoomService';
import { Public } from '../oauth/decorators/public.decorator';
import { hashSync } from 'bcrypt';

@ApiUseTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  @Public()
  @ApiResponse({
    status: 201,
    type: UserDTO,
  })
  @Post()
  async save(@Body() dto: UserRegisterDTO, @UserIp() ip: string) {
    const user = new UserDTO({
      account: {
        email: dto.email,
        username: dto.username,
        password: hashSync(dto.password, 8),
        ip_reg: ip,
      },
      profile: {
        gender: dto.gender,
        birthday: new Date(dto.birthday),
      },
    });

    return this.userService.save(user).then(u => new UserDTO(u));
  }

  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @Get(':user/rooms')
  getRooms(@Param('user') userId: string) {
    return this.roomService.getByOwner(userId);
  }
}
