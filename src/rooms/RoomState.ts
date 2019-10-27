import { Matrix } from "../core"

export class RoomState {
  public map: number[][]
  public mobis = {}
  public users: Map<any, UserState>

  public door: [number, number] = [0, 0]

  constructor (
    {
      map = [],
      mobis = {},
      users = new Map()
    }
  ) {
    this.map = map
    this.mobis = mobis
    this.users = users
  }

  toJSON () {
    return {
      map: this.map,
      mobis: Object.values(this.mobis),
      users: Array.from(this.users.values())
    }
  }
}

export interface UserState {
  position: [number, number]
  socketId: string,
  pathBeingFollowed: [number, number][]
}
