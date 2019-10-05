import { WSChannelList, WSUsersList } from "../types";
import { WSChannel } from "./WSChannel";
import { WSUser } from "./WSUser";
import { Server } from "ws";
import { ShellProvider } from '@open-hotel/orion-core';
export declare class WSServer {
    server: Server;
    users: WSUsersList;
    channels: WSChannelList;
    shellCommand({ _: [bin, action], host, port }: {
        _: [any, any];
        host?: string;
        port?: number;
    }, sh: ShellProvider): Promise<unknown>;
    start({ host, port, }: {
        host?: string;
        port?: number;
    }): Promise<unknown>;
    stop(): Promise<unknown>;
    getUser(user: string | WSUser): WSUser;
    getChannel(channel: string | WSChannel): WSChannel;
    addUser(user: WSUser): this;
    removeUser(username: string): void;
    addUserToChannel(username: string, channelId: string): this;
    removeUserFromChannel(user: string | WSUser, channel: string | WSChannel): this;
}
