import { Matrix } from "@open-hotel/orion-core"

export class RoomState {
  public map: Matrix<number>
  public mobis = {}
  public users: {
    [id:string]: {
      id: string,
      position: [number, number]
    }
  } = {}

  public door: [number, number] = [0, 0]

  toJSON () {
    return {
      map: this.map.$matrix,
      mobis: this.mobis,
      users: this.users
    }
  }
}
