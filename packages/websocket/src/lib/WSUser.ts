import WebSocket from 'ws'
import { Packet } from './Packet'
import { WSChannelList } from '../types'
import { WSChannel } from './WSChannel'

export class WSUser {
  username: string
  user_id : string
  socket: WebSocket
  secret: string
  channels: WSChannelList = {}

  enterChannel (channel:WSChannel) {
    if (this.channels[channel.id]) this.leaveChannel(channel)
    this.channels[channel.id] = channel
    channel.add(this)
    return this
  }

  leaveChannel (channel:string | WSChannel) {
    if (typeof channel === 'string') {
      channel = this.channels[channel]
    }

    if (channel) {
      channel.remove(this)
      delete this.channels[channel.id]
    }

    return this
  }

  disconnect () {
    for (let channel in this.channels) {
      this.leaveChannel(this.channels[channel])
    }

    this.socket.terminate()
  }

  send(packet: Packet) {
    return new Promise((resolve, reject) => {
      this.socket.send(packet.sign(this.secret).toBuffer(), (err) => err ? reject(err) : resolve())
    })
  }

  emit (event:string, ...payload) {
    return this.send(new Packet(event, payload).sign(this.secret))
  }
}