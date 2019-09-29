import { DynamicModule, Type, ForwardReference } from "@nestjs/common";
export declare class Emulator {
    static mainModule: DynamicModule;
    static register(plugin: Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference): typeof Emulator;
    static boot(): Promise<any>;
}
