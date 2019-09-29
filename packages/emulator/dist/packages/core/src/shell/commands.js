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
const decorators_1 = require("./decorators");
const CliTable3 = require("cli-table3");
const common_1 = require("@nestjs/common");
const shell_1 = require("../shell");
let DefaultCommands = class DefaultCommands {
    constructor() {
    }
    help({ _: [bin, command] }, sh) {
        const t = new CliTable3({
            head: ['Command', 'Description', 'Usage']
        });
        t.push(...sh.bin.binsWithoutAliases
            .filter(b => command ? (b.name === command || (b.alias || []).includes(command)) : true)
            .map((b) => [
            (b.alias ? [b.name].concat(b.alias).join('\n') : b.name),
            b.description,
            b.usage || b.name
        ]).sort((a, b) => a[0] < b[0] ? -1 : 1));
        sh.print(t.toString());
    }
    async shutdown(args, sh) {
        await sh.shutdown();
        process.exit();
    }
};
__decorate([
    decorators_1.ShellCommand({
        name: 'help',
        usage: 'help [command]'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, shell_1.ShellProvider]),
    __metadata("design:returntype", void 0)
], DefaultCommands.prototype, "help", null);
__decorate([
    decorators_1.ShellCommand({
        name: 'shutdown',
        alias: ['exit', 'poweroff'],
        description: 'Shutdown Emulator',
        usage: ['shutdown', 'exit', 'poweroff'].join('\n'),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, shell_1.ShellProvider]),
    __metadata("design:returntype", Promise)
], DefaultCommands.prototype, "shutdown", null);
DefaultCommands = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], DefaultCommands);
exports.DefaultCommands = DefaultCommands;
//# sourceMappingURL=commands.js.map