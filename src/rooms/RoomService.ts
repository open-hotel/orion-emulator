import { ArangoCrudService } from "../lib/ArangoCrudService";
import { RoomDTO } from "./dto/Room.dto";
import { InjectArango } from "../lib/injectArango.decorator";
import { Database } from "arangojs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoomService extends ArangoCrudService<RoomDTO> {
  constructor (
    @InjectArango()
    db: Database
  ) {
    super(db, 'rooms')
  }

  popularRooms () {
    return this.db.query(`
      FOR room in rooms
        SORT room.users_now
        FILTER room.state == 'open'
        RETURN room
    `).then(c => c.all())
  }
}