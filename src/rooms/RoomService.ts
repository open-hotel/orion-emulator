import { ArangoCrudService } from '../lib/ArangoCrudService';
import { RoomDTO } from './dto/Room.dto';
import { InjectArango } from '../lib/injectArango.decorator';
import { Database, aql } from 'arangojs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService extends ArangoCrudService<RoomDTO> {
  constructor(
    @InjectArango()
    db: Database,
  ) {
    super(db, 'rooms');
  }

  async getPopular() {
    const cursor = await this.db.query(`
      FOR room in rooms
        FILTER room.users_now > 0 AND room.state == 'open'
        SORT room.users_now DESC
        RETURN room
    `);
    return cursor.map(item => new RoomDTO(item))
  }

  async getByOwner(ownerId: string) {
    const cursor = await this.db.query(
      aql`
      FOR room in rooms
        FILTER room.owner == ${'users/'+ownerId}
        FILTER room.state == 'open'
        SORT room.created_at DESC
        RETURN room
    `);
    return cursor.map(item => new RoomDTO(item))
  }

  async getRoom (roomId:string): Promise<RoomDTO> {
    return this.db.query(
      aql`
        FOR room in rooms
          LIMIT 1
          FILTER room._key == ${roomId}
          return merge(room, { owner: DOCUMENT(room.owner) })
      `
    ).then(async (c) => new RoomDTO(await c.next()))
  }
}
