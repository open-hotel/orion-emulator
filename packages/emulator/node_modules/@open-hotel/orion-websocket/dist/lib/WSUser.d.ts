import WebSocket from 'ws';
import { Packet } from './Packet';
import { WSChannelList } from '../types';
import { WSChannel } from './WSChannel';
export declare class WSUser {
    username: string;
    user_id: string;
    socket: WebSocket;
    secret: string;
    channels: WSChannelList;
    enterChannel(channel: WSChannel): this;
    leaveChannel(channel: string | WSChannel): this;
    disconnect(): void;
    send(packet: Packet): Promise<{}>;
}
