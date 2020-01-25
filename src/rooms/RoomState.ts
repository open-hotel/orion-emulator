import { Matrix } from '../core';
import { RoomDTO } from './dto/Room.dto';
import { UserDTO } from '../user/dto/User.dto';
import { DeepPartial } from '../core/lib';

export class RoomState {
  public room: RoomDTO;
  public map: Matrix<number>;
  public mobis = {};
  public users: Map<any, UserState>;

  constructor({
    room,
    map = new Matrix(1, 1, [0]),
    mobis = {},
    users = new Map(),
  }) {
    this.map = map;
    this.room = room;
    this.mobis = mobis;
    this.users = users;
  }

  toJSON() {
    return {
      room: this.room,
      mobis: Object.values(this.mobis),
      users: Array.from(this.users.values()),
    };
  }
}

export interface UserState {
  position: [number, number];
  user: DeepPartial<UserDTO>,
  socketId: string;
  pathBeingFollowed: [number, number][];
}
