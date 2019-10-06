"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const orion_core_1 = require("@open-hotel/orion-core");
const common_1 = require("@nestjs/common");
const WebSocket = require("ws");
let WebShellProvider = class WebShellProvider {
    constructor(sh) {
        this.sh = sh;
        this.ws = new WebSocket.Server({
            host: '0.0.0.0',
            port: 23456,
        });
    }
    onApplicationBootstrap() {
        this.ws.on('connection', ws => {
            const stream = WebSocket.createWebSocketStream(ws);
            this.sh.startTTY(stream, stream, () => ws.close());
        });
    }
};
WebShellProvider = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [orion_core_1.ShellProvider])
], WebShellProvider);
exports.WebShellProvider = WebShellProvider;
//# sourceMappingURL=WebShell.provider.js.map