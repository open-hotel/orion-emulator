"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const WebShell_provider_1 = require("./WebShell.provider");
const orion_core_1 = require("@open-hotel/orion-core");
let WebShellModule = class WebShellModule {
};
WebShellModule = __decorate([
    common_1.Global(),
    common_1.Module({
        imports: [
            orion_core_1.ShellModule,
            serve_static_1.ServeStaticModule.forRoot({
                renderPath: '/shell',
                rootPath: path_1.resolve(__dirname, '../public')
            })
        ],
        providers: [WebShell_provider_1.WebShellProvider],
        exports: [WebShell_provider_1.WebShellProvider],
    })
], WebShellModule);
exports.WebShellModule = WebShellModule;
//# sourceMappingURL=WebShell.module.js.map