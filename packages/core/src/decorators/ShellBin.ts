import { ShellBin } from '../shell/types';
import { ShellCommandProvider } from '../shell/providers/bin.provider';

export const ShellCommand = (command: ShellBin) => (target, key, descriptor) => {
    // @ts-ignore
    if (!command.main) command.main = (...args) => global.__ORION__.nestApp.get(target.constructor)[key](...args)
    const aliases = [].concat(command.name, command.alias)

    aliases.forEach((alias) => ShellCommandProvider.prepare(command, alias))

    return descriptor
}