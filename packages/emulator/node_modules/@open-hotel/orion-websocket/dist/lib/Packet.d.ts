import WebSocket from 'ws';
export declare class Packet {
    event: string;
    payload: any;
    uuid: string;
    signature?: string;
    static from(data: WebSocket.Data): Packet;
    constructor(event: string, payload?: any, uuid?: string, signature?: string);
    sign(secret: any): Packet;
    validate(secret: any): boolean;
    toBuffer(): any;
}
