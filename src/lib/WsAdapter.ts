import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io'
import { getApp } from '../core/lib/nest.app';
import { UserService } from '../user';

export class WSAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);
    let userService: UserService;
    
    server.use(async (socket, cb) => {
      const { auth_ticket = null } = socket.handshake.query
      if (!auth_ticket) {
        cb(new Error('missing_auth_ticket'))
      } else {
        userService = userService ? userService : (await getApp()).get(UserService);
        socket.user = await userService.findByAuthTicket(auth_ticket)
        if (!socket.user) {
          return cb(new Error('invalid_auth_ticket'))
        }
        cb()
      }
    });
    return server;
  }
}