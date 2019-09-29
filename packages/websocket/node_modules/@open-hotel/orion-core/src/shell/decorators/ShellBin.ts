import { ShellCommandProvider } from '../providers/commands.provider';
import { ShellBin } from '../types';
import { getApp } from '../../lib/nest.app';

export const ShellCommand = (command: ShellBin) => (target, key) => {
    if (!command.main) command.main = (...args) => getApp().get(target.constructor)[key](...args)
    const aliases = [].concat(command.name, command.alias)
    const app = getApp()

    if (app) {
        const bins = app.get(ShellCommandProvider)
        aliases.forEach((alias) => bins.register(command, alias))
        return;
    }

    aliases.forEach((alias) => ShellCommandProvider.prepare(command, alias))
}