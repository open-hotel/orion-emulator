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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const yargs_parser_1 = __importDefault(require("yargs-parser"));
const common_1 = require("@nestjs/common");
const commands_provider_1 = require("./commands.provider");
const services_provider_1 = require("./services.provider");
let ShellProvider = class ShellProvider {
    constructor(bin, service) {
        this.bin = bin;
        this.service = service;
        this.ignoreNextCommand = false;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: `\x1b[36;1mOrion > \x1b[0m`,
            terminal: true,
            removeHistoryDuplicates: true,
        });
        process.on('uncaughtException', (error) => {
            this.ignoreNextCommand = true;
            this.error(error);
        });
        process
            .on('exit', () => this.run('shutdown'))
            .on('SIGINT', () => this.run('shutdown'));
        this.rl.on('SIGINT', () => this.run('shutdown'));
    }
    prompt(prompt) {
        return new Promise(resolve => {
            if (prompt)
                this.rl.setPrompt(prompt);
            this.rl.prompt();
            this.rl.once('line', input => resolve(input));
        });
    }
    print(data, newLine = true) {
        this.rl.write(data);
        newLine && this.rl.write('\n');
    }
    error(errorOrString) {
        const message = typeof errorOrString === 'string' ? errorOrString : errorOrString.message;
        this.print(`\x1b[31mError: ${message}\x1b[0m`);
        return 1;
    }
    async run(cmd, catchErrors = true, args) {
        if (this.ignoreNextCommand) {
            cmd = '';
            this.ignoreNextCommand = false;
        }
        if (!cmd)
            return 0;
        let result = null;
        try {
            if (typeof cmd === 'string') {
                const args = yargs_parser_1.default(cmd);
                const [binName] = args._;
                const command = this.bin.get(binName);
                result = command.main(args, this);
            }
            else if (typeof cmd === 'function') {
                result = cmd(args, this);
            }
            const exitCode = await result;
            return typeof exitCode === 'number' ? result : 0;
        }
        catch (err) {
            if (catchErrors)
                return this.error(err);
            throw err;
        }
    }
    async start() {
        await this.service.boot(this);
        while (true) {
            const cmd = await this.prompt();
            await this.run(cmd);
        }
    }
    async onApplicationBootstrap() {
        setImmediate(() => this.start());
    }
};
ShellProvider = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [commands_provider_1.ShellCommandProvider,
        services_provider_1.ShellServicesProvider])
], ShellProvider);
exports.ShellProvider = ShellProvider;
//# sourceMappingURL=shell.provider.js.map