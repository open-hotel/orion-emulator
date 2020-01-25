import { RoomService } from "./RoomService";
import { Controller, Post, Body, Get } from "@nestjs/common";
import { ApiUseTags, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { RoomRegisterDTO } from "./dto/RoomRegister.dto";
import { RoomDTO } from "./dto/Room.dto";
import { Database } from "arangojs";
import { InjectArango } from "../lib/injectArango.decorator";
import { CurrentUser } from "../oauth/decorators/user.decorator";
import { UserDTO } from "../user/dto/User.dto";

@ApiUseTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor (
    public roomService: RoomService,
    @InjectArango()
    public db: Database
  ) {}

  @ApiCreatedResponse({
    type: RoomDTO,
    description: 'Create a new room'
  })
  @Post()
  register (@Body() dto: RoomRegisterDTO, @CurrentUser() user:UserDTO) {
    const data = new RoomDTO({
      ...dto,
      owner: user._id
    })

    return this.roomService.save(data)
  }

  @ApiOkResponse({
    type: RoomDTO,
    isArray: true,
    description: 'List all popular rooms'
  })
  @Get()
  getPopular () {
    return this.roomService.getPopular()
  }
}