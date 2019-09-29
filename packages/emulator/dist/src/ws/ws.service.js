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
const common_1 = require("@nestjs/common");
const ws_1 = require("ws");
const WSClient_1 = require("./WSClient");
const Packet_1 = require("../../packages/websocket/src/Packet");
const ShellBin_1 = require("../../packages/core/src/shell/decorators/ShellBin");
const ShellService_1 = require("../../packages/core/src/shell/decorators/ShellService");
const { WS_HOST = 'localhost', WS_PORT = 6552 } = process.env;
let WsService = class WsService {
    constructor() {
        this.logger = new common_1.Logger('WebSocket');
    }
    bin({ _: [bin, action = 'start'], port = WS_PORT, host = WS_HOST }) {
        if (action === 'start')
            return this.start(host, Number(port));
        if (action === 'stop')
            return this.stop();
    }
    stop() {
        if (!this.server) {
            throw new Error('Not started');
        }
        this.server.close();
        this.server = null;
    }
    start(host, port) {
        return new Promise((resolve, reject) => {
            if (this.server) {
                return reject(new Error('Already started!'));
            }
            this.server = new ws_1.Server({ host, port });
            this.server
                .once('listening', () => {
                resolve();
                this.logger.log(`Listening connections at ws://${host}:${port}`);
            })
                .once('error', (_, err) => {
                reject(err);
                this.logger.error('ERROR', err);
            })
                .on('headers', headers => this.logger.log('HEADERS', headers.join(',\n')))
                .on('connection', (ws, request) => {
                const user = new WSClient_1.WSClient(ws, request);
                ws.on('message', wsdata => {
                    if (Buffer.isBuffer(wsdata)) {
                        const data = Packet_1.Packet.from(wsdata);
                        ws.send(data.serialize());
                    }
                    else {
                        ws.send(new Packet_1.Packet('INVALID').serialize());
                    }
                });
            });
        });
    }
};
__decorate([
    ShellService_1.ShellService({
        name: 'ws',
        boot: true,
        description: 'WebSocket server',
        title: 'WebSocket Server',
        after: 'api',
    }),
    ShellBin_1.ShellCommand({
        name: 'ws',
        description: 'WebSocket server',
        usage: 'ws <action> --host=<host> --port=<port>'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WsService.prototype, "bin", null);
WsService = __decorate([
    common_1.Injectable()
], WsService);
exports.WsService = WsService;
//# sourceMappingURL=ws.service.js.map