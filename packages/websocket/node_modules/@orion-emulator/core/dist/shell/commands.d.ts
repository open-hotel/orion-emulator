import { ShellProvider } from "../shell";
export declare class DefaultCommands {
    help({ _: [bin, command] }: {
        _: [any, any];
    }, sh: ShellProvider): void;
}
