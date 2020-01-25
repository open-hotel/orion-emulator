import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';
import { getApp } from '../core/lib/nest.app';
import { UserService } from '../user';
import { Duplex, PassThrough } from 'stream';
import { ShellProvider } from '../core';

export class WSAdapter extends IoAdapter {
  createStream (socket:Socket) {
    const stream = new PassThrough({
      write (chunk, encoding, cb) {
        socket.emit('data', chunk);
        cb()
      },
    })

    socket.on('data', data => stream.push(data))

    return stream
  }

  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);
    let userService: UserService;
    let shell: ShellProvider;

    // Game Auth
    server.of('/game').use(async (socket, cb) => {
      const { auth_ticket = null } = socket.handshake.query;
      if (!auth_ticket) {
        cb(new Error('missing_auth_ticket'));
      } else {
        userService = userService
          ? userService
          : (await getApp()).get(UserService);
        socket.user = await userService.findByAuthTicket(auth_ticket);
        if (!socket.user) {
          return cb(new Error('invalid_auth_ticket'));
        }
      }
      cb();
    });

    // WebShellAuth
    server.of('/orion').use(async (socket: Socket, cb: (err?: any) => void) => {
      shell = shell
          ? shell
          : (await getApp()).get(ShellProvider);
      const stream = this.createStream(socket);
      shell.startTTY(shell.createTTY(stream, stream))
      cb()
    });
    return server;
  }
}
