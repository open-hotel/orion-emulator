import { Module, OnModuleInit } from '@nestjs/common';
import { RoomGateway } from './Room.gateway';
import { RoomService } from './RoomService';
import { RoomController } from './RoomController';
import { CreateIfNotExists } from '../lib/ArangoDDL';
import { RoomDTO } from './dto/Room.dto';
import { InjectArango } from '../lib/injectArango.decorator';
import { Database } from 'arangojs';

@Module({
  controllers: [RoomController],
  providers: [RoomGateway, RoomService],
  exports: [RoomService],
})
export class RoomModule implements OnModuleInit {
  @InjectArango()
  private readonly db: Database;
  
  async onModuleInit() {
    const rooms = this.db.collection<RoomDTO>('rooms');
    await CreateIfNotExists.collection(rooms);
  }
}
