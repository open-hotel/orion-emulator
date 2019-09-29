"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ShellCommandProvider_1;
const common_1 = require("@nestjs/common");
let ShellCommandProvider = ShellCommandProvider_1 = class ShellCommandProvider {
    constructor() {
        this.bin = {};
    }
    onApplicationBootstrap() {
        this.bin = Object.assign({}, this.bin, ShellCommandProvider_1.preparedBins);
        ShellCommandProvider_1.preparedBins = {};
    }
    get binsWithoutAliases() {
        const binNames = [];
        return Object.values(this.bin).filter(item => {
            const exists = binNames.includes(item.name);
            if (!exists) {
                binNames.push(item.name);
                return true;
            }
            return false;
        });
    }
    static prepare(command, alias = command.name) {
        this.preparedBins[alias] = command;
        return this;
    }
    register(command, alias = command.name) {
        this.bin[alias] = command;
        return this;
    }
    get(name) {
        const command = this.bin[name];
        if (!command)
            throw new Error('Command Not Found!');
        return command;
    }
};
ShellCommandProvider.preparedBins = {};
ShellCommandProvider = ShellCommandProvider_1 = __decorate([
    common_1.Injectable()
], ShellCommandProvider);
exports.ShellCommandProvider = ShellCommandProvider;
//# sourceMappingURL=commands.provider.js.map