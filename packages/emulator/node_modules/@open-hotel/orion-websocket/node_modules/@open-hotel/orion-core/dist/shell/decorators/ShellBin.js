"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_provider_1 = require("../providers/commands.provider");
const nest_app_1 = require("../../lib/nest.app");
exports.ShellCommand = (command) => (target, key) => {
    if (!command.main)
        command.main = (...args) => nest_app_1.getApp().get(target.constructor)[key](...args);
    const aliases = [].concat(command.name, command.alias);
    const app = nest_app_1.getApp();
    if (app) {
        const bins = app.get(commands_provider_1.ShellCommandProvider);
        aliases.forEach((alias) => bins.register(command, alias));
        return;
    }
    aliases.forEach((alias) => commands_provider_1.ShellCommandProvider.prepare(command, alias));
};
//# sourceMappingURL=ShellBin.js.map