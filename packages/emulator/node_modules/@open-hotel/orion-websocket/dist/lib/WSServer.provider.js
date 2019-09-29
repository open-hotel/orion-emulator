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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const WSChannel_1 = require("./WSChannel");
const ws_1 = require("ws");
const common_1 = require("@nestjs/common");
const core_1 = require("@orion-emulator/core");
const Packet_1 = require("./Packet");
const url = __importStar(require("url"));
const qs = __importStar(require("querystring"));
let WSServer = class WSServer {
    shellCommand({ _: [bin, action], host = '0.0.0.0', port = 6543 }, sh) {
        if (action === 'start')
            return this.start({ host, port: Number(port) });
        if (action === 'stop')
            return this.stop();
        return sh.run('help websocket');
    }
    start({ host = process.env.WS_HOST, port = Number(process.env.WS_PORT), }) {
        return new Promise((resolve) => {
            this.server = new ws_1.Server({
                host,
                port,
                path: '/orion',
                verifyClient(client, done) {
                    const TICKET = '12345678';
                    const { query } = url.parse(client.req.url);
                    const params = qs.parse(query);
                    const authorized = params.ticket === TICKET;
                    done(authorized, authorized ? 200 : 400, authorized ? 'OK' : 'Invalid Ticket');
                }
            }, resolve);
            this.server.on('connection', (socket) => {
                socket.on('message', (data) => {
                    const packet = Packet_1.Packet.from(data);
                    socket.send(packet.sign('123').toBuffer());
                });
            });
        });
    }
    stop() {
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                this.users = {};
                this.channels = {};
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    getUser(user) {
        const username = typeof user === 'string' ? user : user.user_id;
        return this.users[username] || null;
    }
    getChannel(channel) {
        const channelId = typeof channel === 'string' ? channel : channel.id;
        if (channelId in this.channels)
            return this.channels[channelId];
        return this.channels[channelId] = new WSChannel_1.WSChannel(channelId);
    }
    addUser(user) {
        this.users[user.user_id] = user;
        user.enterChannel(this.getChannel('@global'));
        return this;
    }
    removeUser(username) {
        const user = this.getUser(username);
        if (user)
            user.disconnect();
        this.removeUser(username);
    }
    addUserToChannel(username, channelId) {
        const user = this.getUser(username);
        let channel = this.getChannel(channelId);
        if (user)
            user.enterChannel(channel);
        return this;
    }
    removeUserFromChannel(user, channel) {
        user = this.getUser(user);
        channel = this.getChannel(channel);
        if (user) {
            user.leaveChannel(channel);
        }
        return this;
    }
};
__decorate([
    core_1.ShellService({
        name: 'websocket',
        title: 'WebSocket Server',
        description: 'Websocket Server',
        boot: true,
        after: ['api'],
    }),
    core_1.ShellCommand({
        name: 'websocket',
        alias: ['ws'],
        description: 'Controls websocket server',
        usage: 'websocket <start|stop|restart>'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, core_1.ShellProvider]),
    __metadata("design:returntype", void 0)
], WSServer.prototype, "shellCommand", null);
WSServer = __decorate([
    common_1.Injectable()
], WSServer);
exports.WSServer = WSServer;
//# sourceMappingURL=WSServer.provider.js.map