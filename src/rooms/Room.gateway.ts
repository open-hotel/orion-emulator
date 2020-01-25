import {
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  SubscribeMessage,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PathFinder, Matrix } from '../core/lib';
import { RoomState, UserState } from './RoomState';
import { RoomService } from './RoomService';
import { UserDTO } from '../user/dto/User.dto';
import { RateLimiter } from '../lib/RateLimiter';
import { classToPlain } from 'class-transformer';

declare module 'socket.io' {
  interface Socket {
    currentRoom: string;
    user: UserDTO
  }
}

@WebSocketGateway({ namespace: '/game' })
export class RoomGateway implements OnGatewayInit, OnGatewayDisconnect {
  private server: Server;
  private rooms: WeakMap<any, RoomState> = new Map();
  private stepLimiter = new RateLimiter({
    time: 800,
    max: 1
  })

  constructor (
    private roomSevice: RoomService
  ) {}

  roomName(id: string) {
    return ['rooms', id].join('/');
  }

  sendError (error:string) {
    return {
      status: 0,
      error
    }
  }

  sendData (data:any) {
    return {
      status: 1,
      data
    }
  }

  @SubscribeMessage('room:join')
  async joinRoom(
    @MessageBody()
    msgBody: { roomId: string },
    @ConnectedSocket()
    socket: Socket,
  ) {
    let roomState = this.rooms.get(msgBody.roomId);

    if (!roomState) {
      const room = (await this.roomSevice.getRoom(msgBody.roomId))

      if (!room) return this.sendError('room_not_found')
      
      roomState = new RoomState({
        room: classToPlain(room),
        map: Matrix.fromLegacyString(room.map),
        mobis: room.items,
      });
      
      this.rooms.set(msgBody.roomId, roomState);
    }

    const room = this.roomName(msgBody.roomId);
    const userState: UserState = {
      position: [0, 0],
      user: classToPlain(socket.user),
      socketId: socket.id,
      pathBeingFollowed: [],
    };

    roomState.users.set(socket.id, userState);

    socket.join(room);
    socket.currentRoom = msgBody.roomId;
    socket.to(room).emit('room:join', userState);
    return this.sendData(roomState);
  }

  @SubscribeMessage('user:speak')
  speak(
    @MessageBody()
    msgBody: { text: string },
    @ConnectedSocket()
    socket: Socket,
  ) {
    const room = this.roomName(socket.currentRoom);
    const payload = {
      from: socket.id,
      text: msgBody.text,
      timestamp: Date.now(),
    };
    this.server.in(room).emit('user:speak', payload);
  }

  @SubscribeMessage('user:walk')
  walk(
    @MessageBody()
    position: [number, number],
    @ConnectedSocket()
    socket: Socket,
  ) {
    const roomState = this.rooms.get(socket.currentRoom);
    const user = roomState.users.get(socket.id);
    const grid = roomState.map;
    const pathFinder = new PathFinder(grid, (tile1, tile2) => {
      const a = grid.get(tile1.x, tile1.y);
      const b = grid.get(tile2.x, tile2.y)

      // if (!this.canWalkTo(cell.x, cell.y)) {
      //   return false
      // }

      // Stairs
      return a === b || Math.abs(a - b) === 1;
    });

    const [x, y] = user.position;
    const [toX, toY] = position;

    const path = pathFinder.find({ x, y }, { x: toX, y: toY });

    user.pathBeingFollowed = path;

    return path ? this.sendData(path) : this.sendError('invalid_tile');
  }

  @SubscribeMessage('user:step')
  async userStep(
    @ConnectedSocket()
    socket: Socket,
  ) {
    if (!await this.stepLimiter.tap(socket.user._key).catch(() => false)) return;
    const room = this.roomName(socket.currentRoom);
    const roomState = this.rooms.get(socket.currentRoom);
    const user = roomState.users.get(socket.id);
    user.position = user.pathBeingFollowed.shift();
    this.server.in(room).emit('user:walk', user);
  }

  handleDisconnect(socket: Socket) {
    if (!socket.currentRoom) {
      return;
    }
    const room = `rooms/${socket.currentRoom}`;
    const roomState = this.rooms.get(socket.currentRoom);
    roomState.users.delete(socket.id);
    this.server.to(room).emit('user:leave', { socketId: socket.id });
  }

  afterInit(server: Server) {
    this.server = server;
  }
}
