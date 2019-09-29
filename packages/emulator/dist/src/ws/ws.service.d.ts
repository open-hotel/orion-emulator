import { Server } from 'ws';
export declare class WsService {
    private logger;
    server: Server;
    bin({ _: [bin, action], port, host }: {
        _: [any, string?];
        port?: string | number;
        host?: string;
    }): void | Promise<{}>;
    stop(): void;
    start(host: string, port: number): Promise<{}>;
}
