import { OnApplicationBootstrap } from '@nestjs/common';
import { ShellProvider } from './shell.provider';
import { ShellServiceBin } from '../types';
export declare class ShellServicesProvider implements OnApplicationBootstrap {
    onApplicationBootstrap(): void;
    private static preparedServices;
    private services;
    static prepare(command: ShellServiceBin): typeof ShellServicesProvider;
    register(command: ShellServiceBin): this;
    get(name: string): ShellServiceBin;
    boot(sh: ShellProvider, shutdown?: boolean): Promise<boolean>;
    shutdown(args: any, sh: ShellProvider): Promise<void>;
}
