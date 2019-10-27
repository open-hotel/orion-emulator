import { Module } from "@nestjs/common";
import { RoomGateway } from "./Room.gateway";
import { RoomService } from "./RoomService";
import { RoomController } from "./RoomController";

@Module({
    controllers: [RoomController],
    providers: [RoomGateway, RoomService],
    exports: [RoomService]
})
export class RoomModule {

}