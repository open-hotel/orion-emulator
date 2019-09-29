/// <reference types="node" />
import * as readline from 'readline';
import { OnApplicationBootstrap } from '@nestjs/common';
import { ShellCommandProvider } from './commands.provider';
import { ShellServicesProvider } from './services.provider';
export declare class ShellProvider implements OnApplicationBootstrap {
    private bin;
    private service;
    private ignoreNextCommand;
    constructor(bin: ShellCommandProvider, service: ShellServicesProvider);
    rl: readline.Interface;
    prompt(prompt?: string): Promise<string>;
    print(data: string | Buffer, newLine?: boolean): void;
    error(errorOrString: string | Error): number;
    run(cmd: string | Function, catchErrors?: boolean, args?: any): Promise<number>;
    start(): Promise<void>;
    onApplicationBootstrap(): Promise<void>;
}
