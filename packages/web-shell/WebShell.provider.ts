import { ShellProvider } from '../../src/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import WebSocket = require('ws');
import { Duplex } from 'stream';

@Injectable()
export class WebShellProvider implements OnApplicationBootstrap {
  private ws = new WebSocket.Server({
    host: '0.0.0.0',
    port: 23456,
  });

  constructor(private sh: ShellProvider) {}

  onApplicationBootstrap() {
    this.ws.on('connection', async ws => {
      // @ts-ignore
      const stream: Duplex = WebSocket.createWebSocketStream(ws);
      const session = this.sh.createTTY(stream, stream)
      await this.sh.startTTY(session)
      ws.terminate()
    });
  }
}

