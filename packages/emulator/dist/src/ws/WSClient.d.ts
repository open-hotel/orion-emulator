/// <reference types="node" />
import { IncomingMessage } from 'http';
import WebSocket from 'ws';
export declare class WSClient {
    ws: WebSocket;
    username: string;
    address: string;
    secret: string;
    connectedAt: Date;
    constructor(ws: WebSocket, request: IncomingMessage);
    setUsername(username: any): this;
    generateSecret(): this;
}
