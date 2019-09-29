"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Emulator_1;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const shell_1 = require("../shell");
const Events_provider_1 = require("./Events.provider");
const nest_app_1 = require("./nest.app");
let Emulator = Emulator_1 = class Emulator {
    static register(plugin) {
        this.mainModule.imports.push(plugin);
        return this;
    }
    static async boot() {
        let app = nest_app_1.getApp();
        if (app)
            return null;
        app = await core_1.NestFactory.create(this.mainModule);
        app.init();
        nest_app_1.setApp(app);
    }
};
Emulator.mainModule = {
    imports: [shell_1.ShellModule],
    providers: [Events_provider_1.EventsProvider],
    exports: [Events_provider_1.EventsProvider],
    module: Emulator_1
};
Emulator = Emulator_1 = __decorate([
    common_1.Global(),
    common_1.Module({})
], Emulator);
exports.Emulator = Emulator;
global.__ORION__ = Emulator;
//# sourceMappingURL=Emulator.js.map