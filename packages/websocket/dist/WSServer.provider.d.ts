import { WSChannelList, WSUsersList } from "./types";
import { WSChannel } from "./WSChannel";
import { WSUser } from "./WSUser";
import { Server } from "ws";
import { ShellProvider } from '@orion-emulator/core';
export declare class WSServer {
    server: Server;
    users: WSUsersList;
    channels: WSChannelList;
    shellCommand({ _: [bin, action], host, port }: {
        _: [any, any];
        host?: string;
        port?: number;
    }, sh: ShellProvider): void | Promise<{}>;
    start({ host, port, }: {
        host?: string;
        port?: number;
    }): void;
    stop(): Promise<{}>;
    getUser(user: string | WSUser): WSUser;
    getChannel(channel: string | WSChannel): WSChannel;
    addUser(user: WSUser): this;
    removeUser(username: string): void;
    addUserToChannel(username: string, channelId: string): this;
    removeUserFromChannel(user: string | WSUser, channel: string | WSChannel): this;
}
