import { WSChannelList, WSUsersList } from '../types';
import { WSChannel } from './WSChannel';
import { WSUser } from './WSUser';
import { Server } from 'ws';
import { Injectable } from '@nestjs/common';
import {
  ShellCommand,
  ShellSession,
  ShellService,
} from '@open-hotel/orion-core';
import { Packet } from './Packet';
import * as url from 'url';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import { EventEmitter } from 'events'
import uuid from 'uuid'

@Injectable()
export class WSServer extends EventEmitter {
  server: Server;
  users: WSUsersList;
  channels: WSChannelList;

  @ShellService({
    name: 'websocket',
    title: 'WebSocket Server',
    description: 'Websocket Server',
    boot: true,
    after: ['api'],
  })
  @ShellCommand({
    name: 'websocket',
    alias: ['ws'],
    description: 'Controls websocket server',
    usage: 'websocket <start|stop|restart>',
  })
  shellCommand(
    { _: [bin, action], host = '0.0.0.0', port = 65432 },
    sh: ShellSession,
  ) {
    if (action === 'start') return this.start({ host, port: Number(port) });
    if (action === 'stop') return this.stop();
    return sh.run('help websocket');
  }

  start({ host = process.env.WS_HOST, port = Number(process.env.WS_PORT) }) {
    return new Promise(resolve => {
      this.server = new Server(
        {
          host,
          port,
          // verifyClient(client, done) {
          //   const TICKET = '12345678';
          //   const { query, pathname } = url.parse(client.req.url);
          //   const params = qs.parse(query);
          //   const authorized = pathname === '/orion' ? params.ticket === TICKET : true;
          //   done(
          //     authorized,
          //     authorized ? 200 : 402,
          //     authorized ? 'OK' : 'Invalid Ticket',
          //   );
          // },
        },
        resolve,
      );

      this.server.on('connection', socket => {
        socket.on('message', data => {
          const packet = Packet.from(data);
          if (packet.validate('123')) {
            super.emit(packet.event, ...packet.payload)
          }
        });
      });

      this.server.on('connection:web-shell', socket => {
        socket.on('message', data => {
          socket.send('shell-command');
        });
      });

      this.server.on(
        'upgrade',
        (request: IncomingMessage, socket: Socket, head: Buffer) => {
          const { pathname } = url.parse(request.url);

          if (pathname === '/orion') {
            return this.server.handleUpgrade(request, socket, head, ws => {
              this.server.emit('connection', ws, request);
            });
          }

          if (pathname === '/orion-shell') {
            return this.server.handleUpgrade(request, socket, head, ws => {
              this.server.emit('connection:web-shell', ws, request);
            });
          }

          socket.destroy();
        },
      );
    });
  }

  stop() {
    if (!this.server) return 0
    return new Promise((resolve, reject) => {
      this.server.close(err => {
        this.users = {};
        this.channels = {};
        if (err) return reject(err);
        resolve();
      });
    });
  }

  getUser(user: string | WSUser) {
    const username = typeof user === 'string' ? user : user.user_id;
    return this.users[username] || null;
  }

  getChannel(channel: string | WSChannel) {
    const channelId = typeof channel === 'string' ? channel : channel.id;
    if (channelId in this.channels) return this.channels[channelId];
    return (this.channels[channelId] = new WSChannel(channelId));
  }

  addUser(user: WSUser) {
    this.users[user.user_id] = user;
    user.enterChannel(this.getChannel('@global'));
    return this;
  }

  removeUser(username: string) {
    const user = this.getUser(username);

    if (user) user.disconnect();

    this.removeUser(username);
  }

  addUserToChannel(username: string, channelId: string) {
    const user = this.getUser(username);
    let channel = this.getChannel(channelId);

    if (user) user.enterChannel(channel);

    return this;
  }

  removeUserFromChannel(user: string | WSUser, channel: string | WSChannel) {
    user = this.getUser(user);
    channel = this.getChannel(channel);

    if (user) {
      user.leaveChannel(channel);
    }

    return this;
  }
}
