import { Module } from "@nestjs/common";
import { RoomGateway } from "./Room.gateway";

@Module({
    providers: [RoomGateway]
})
export class RoomModule {

}