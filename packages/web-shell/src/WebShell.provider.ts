import { ShellProvider } from '@open-hotel/orion-core';
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
    this.ws.on('connection', ws => {
      // @ts-ignore
      const stream: Duplex = WebSocket.createWebSocketStream(ws);
      this.sh.startTTY(stream, stream, () => ws.close())
    });
  }
}
