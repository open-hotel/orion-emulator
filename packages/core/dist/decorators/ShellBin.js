"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_provider_1 = require("../shell/providers/commands.provider");
exports.ShellCommand = (command) => (target, key, descriptor) => {
    if (!command.main)
        command.main = (...args) => global.__ORION__.nestApp.get(target.constructor)[key](...args);
    const aliases = [].concat(command.name, command.alias);
    aliases.forEach((alias) => commands_provider_1.ShellCommandProvider.prepare(command, alias));
    return descriptor;
};
//# sourceMappingURL=ShellBin.js.map