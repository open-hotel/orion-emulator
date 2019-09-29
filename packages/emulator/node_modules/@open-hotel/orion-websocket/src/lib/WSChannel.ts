import { Packet } from './Packet'
import { WSUsersList } from '../types'
import { WSUser } from './WSUser'

export class WSChannel {
  users: WSUsersList

  constructor (
    public id:string
  ) {}

  add (user:WSUser) {
    this.users[user.username] = user
    return this
  }

  remove (user: WSUser | string) {
    if (user instanceof WSUser) user = user.username
    delete this.users[user]
    return this
  }

  async send(packet: Packet) {
    for (let u in this.users) {
      const user = this.users[u]
      return user.send(packet)
    }
  }
}