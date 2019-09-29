import { Packet } from './Packet';
import { WSUsersList } from '../types';
import { WSUser } from './WSUser';
export declare class WSChannel {
    id: string;
    users: WSUsersList;
    constructor(id: string);
    add(user: WSUser): this;
    remove(user: WSUser | string): this;
    send(packet: Packet): Promise<{}>;
}
