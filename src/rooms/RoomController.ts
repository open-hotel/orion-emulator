import { RoomService } from "./RoomService";
import { Controller, Post, Body, Get } from "@nestjs/common";
import { ApiUseTags, ApiCreatedResponse } from "@nestjs/swagger";
import { RoomRegisterDTO } from "./dto/RoomRegister.dto";
import { RoomDTO } from "./dto/Room.dto";

@ApiUseTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor (
    public roomService: RoomService
  ) {}

  @ApiCreatedResponse({
    type: RoomDTO
  })
  @Post()
  register (@Body() dto: RoomRegisterDTO) {
    const data = new RoomDTO({
      ...dto,
      owner: null
    })

    return this.roomService.save(data)
  }

  @Get()
  list () {
    return this.roomService.popularRooms()
  }
}