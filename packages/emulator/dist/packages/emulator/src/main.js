"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@orion-emulator/core");
const ws_module_1 = require("../../../src/ws/ws.module");
core_1.Emulator
    .register(ws_module_1.WsModule)
    .boot();
//# sourceMappingURL=main.js.map