import { ShellProvider } from '@open-hotel/orion-core';
import { OnApplicationBootstrap } from '@nestjs/common';
export declare class WebShellProvider implements OnApplicationBootstrap {
    private sh;
    private ws;
    constructor(sh: ShellProvider);
    onApplicationBootstrap(): void;
}
