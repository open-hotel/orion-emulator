import { WSUser } from "../lib/WSUser"
import { WSChannel } from "../lib/WSChannel"

export type WSChannelList = {
  [name:string]: WSChannel
}

export type WSUsersList = {
  [username:string]: WSUser
}