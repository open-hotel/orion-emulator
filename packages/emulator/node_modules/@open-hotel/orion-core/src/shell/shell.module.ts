import { Module, Global } from "@nestjs/common";
import { ShellProvider } from "./providers/shell.provider";
import { ShellCommandProvider } from "./providers/commands.provider";
import { ShellServicesProvider } from "./providers/services.provider";
import { DefaultCommands } from "../shell/commands";

@Global()
@Module({
    imports: [],
    providers: [
        ShellProvider,
        ShellCommandProvider,
        ShellServicesProvider,
        DefaultCommands
    ],
    exports: [ShellProvider],
})
export class ShellModule {}