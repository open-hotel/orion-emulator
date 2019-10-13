import { User } from "./User";

export interface RoomPreferences {
  password: string
  users_max: number
}

export interface RoomInfo {
  caption: string
  description: string
  state: string
  users_now: number
}

export interface Room extends RoomInfo, RoomPreferences {
  owner: User
}