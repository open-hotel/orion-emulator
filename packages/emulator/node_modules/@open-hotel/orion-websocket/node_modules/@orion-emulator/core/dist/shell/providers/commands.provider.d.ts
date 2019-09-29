import { OnApplicationBootstrap } from '@nestjs/common';
import { ShellBin } from '../types';
export declare class ShellCommandProvider implements OnApplicationBootstrap {
    onApplicationBootstrap(): void;
    private static preparedBins;
    private bin;
    readonly binsWithoutAliases: ShellBin[];
    static prepare(command: ShellBin, alias?: string): typeof ShellCommandProvider;
    register(command: ShellBin, alias?: string): this;
    get(name: string): ShellBin;
}
