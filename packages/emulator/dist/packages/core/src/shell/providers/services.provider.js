"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ShellServicesProvider_1;
const perf_hooks_1 = require("perf_hooks");
const common_1 = require("@nestjs/common");
const ora = require("ora");
const ms_1 = __importDefault(require("ms"));
let ShellServicesProvider = ShellServicesProvider_1 = class ShellServicesProvider {
    constructor() {
        this.services = {};
    }
    onApplicationBootstrap() {
        this.services = Object.assign({}, this.services, ShellServicesProvider_1.preparedServices);
        ShellServicesProvider_1.preparedServices = {};
    }
    static prepare(command) {
        this.preparedServices[command.name] = command;
        return this;
    }
    register(command) {
        this.services[command.name] = command;
        return this;
    }
    get(name) {
        const command = this.services[name];
        if (!command)
            throw new Error('Service Not Found!');
        return command;
    }
    async boot(sh, shutdown = false) {
        const loader = ora().start(`Starting Orion Emulator...`);
        const services = Object.values(this.services)
            .filter(service => service.boot)
            .sort((a, b) => {
            if ([].concat(b.after).includes(a.name))
                return -1;
            if ([].concat(b.before).includes(a.name))
                return 1;
            return 0;
        });
        if (shutdown) {
            const start = perf_hooks_1.performance.now();
            services.reverse();
            for (let service of services) {
                const start = perf_hooks_1.performance.now();
                loader.start(`Waiting for ${service.title}...`);
                await sh
                    .run(service.main, false, { _: [service.name, 'stop'] })
                    .then(() => {
                    const time = Math.round(perf_hooks_1.performance.now() - start);
                    loader.succeed(`Stopped ${service.title}\t+${ms_1.default(time)}`);
                })
                    .catch(err => {
                    const time = Math.round(perf_hooks_1.performance.now() - start);
                    loader.fail(`${service.title}\t+${ms_1.default(time)}\n  Error: ${err.message}`);
                });
            }
            const time = Math.round(perf_hooks_1.performance.now() - start);
            loader.succeed(`Shutdown finished\t+${ms_1.default(time)}`);
            return true;
        }
        const start = perf_hooks_1.performance.now();
        for (let service of services) {
            const start = perf_hooks_1.performance.now();
            loader.start(`\x1b[2mStarting ${service.title}...\x1b[0m`);
            const execution = sh
                .run(service.main, false, { _: [service.name, 'start'] })
                .then(() => {
                const time = Math.round(perf_hooks_1.performance.now() - start);
                loader.succeed(`\x1b[32mStarted ${service.title}\x1b[0m\t+${ms_1.default(time)}`);
            })
                .catch(err => {
                const time = Math.round(perf_hooks_1.performance.now() - start);
                loader.fail(`\x1b[31;1mFailed to start ${service.title}\t+${ms_1.default(time)}\n  \x1b[1mError:\x1b[0m \x1b[31m${err.message}\x1b[0m`);
            });
            if (!service.async)
                await execution;
        }
        const time = Math.round(perf_hooks_1.performance.now() - start);
        loader.succeed(`Orion Emulator is Ready! \t+${ms_1.default(time)}`);
    }
};
ShellServicesProvider.preparedServices = {};
ShellServicesProvider = ShellServicesProvider_1 = __decorate([
    common_1.Injectable()
], ShellServicesProvider);
exports.ShellServicesProvider = ShellServicesProvider;
//# sourceMappingURL=services.provider.js.map