"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const shell_provider_1 = require("./providers/shell.provider");
const commands_provider_1 = require("./providers/commands.provider");
const services_provider_1 = require("./providers/services.provider");
const commands_1 = require("../shell/commands");
let ShellModule = class ShellModule {
};
ShellModule = __decorate([
    common_1.Global(),
    common_1.Module({
        imports: [],
        providers: [
            shell_provider_1.ShellProvider,
            commands_provider_1.ShellCommandProvider,
            services_provider_1.ShellServicesProvider,
            commands_1.DefaultCommands
        ],
        exports: [shell_provider_1.ShellProvider],
    })
], ShellModule);
exports.ShellModule = ShellModule;
//# sourceMappingURL=shell.module.js.map