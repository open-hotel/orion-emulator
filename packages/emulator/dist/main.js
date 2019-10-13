"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const path_1 = require("path");
const envFile = yargs_1.default.parse().config || path_1.resolve(__dirname, '../config.env');
require('dotenv').config({ path: envFile });
const orion_core_1 = require("@open-hotel/orion-core");
const orion_websocket_1 = require("@open-hotel/orion-websocket");
const orion_webshell_1 = require("@open-hotel/orion-webshell");
const orion_banner_1 = require("@open-hotel/orion-banner");
const orion_arangodb_1 = require("@open-hotel/orion-arangodb");
const gateway1_gateway_1 = require("./gateway1.gateway");
const gateway2_gateway_1 = require("./gateway2.gateway");
orion_core_1.Emulator.mainModule.providers.push(gateway1_gateway_1.Gateway1, gateway2_gateway_1.Gateway2);
orion_core_1.Emulator.register(orion_websocket_1.WSModule)
    .register(orion_webshell_1.WebShellModule)
    .register(orion_arangodb_1.OrionArangoModule.configure())
    .register(orion_banner_1.BannerModule)
    .boot();
//# sourceMappingURL=main.js.map