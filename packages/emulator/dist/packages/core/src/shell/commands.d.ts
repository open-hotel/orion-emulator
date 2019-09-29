import { ShellProvider } from "../shell";
export declare class DefaultCommands {
    constructor();
    help({ _: [bin, command] }: {
        _: [any, any];
    }, sh: ShellProvider): void;
    shutdown(args: any, sh: ShellProvider): Promise<void>;
}
