import { ShellCommand, ShellService } from './decorators';
import CliTable3 = require('cli-table3');
import { Injectable } from '@nestjs/common';
import { getApp } from '../lib/nest.app';
import { ShellSession } from './providers';

@Injectable()
export class DefaultCommands {
  @ShellService({
    name: 'api',
    title: 'Habbo API',
    alias: ['web'],
    description: 'Controls API status',
    boot: true,
  })
  @ShellCommand({
    name: 'api',
    alias: ['web'],
    description: 'Controls API status',
    usage: 'api <start|stop|restart>',
  })
  api({ _: [bin, command] }, session: ShellSession) {
    const app = getApp();
    if (command === 'start') return app.listen(3000);
    if (command === 'stop') return app.close();
    return session.run(`help ${bin}`);
  }

  @ShellCommand({
    name: 'help',
    usage: 'help [command]',
  })
  help({ _: [bin, command] }, session: ShellSession) {
    const t = new CliTable3({
      head: ['Command', 'Description', 'Usage'],
    });

    t.push(
      //@ts-ignore
      ...session.sh.bin.binsWithoutAliases
        .filter(b =>
          command
            ? b.name === command || (b.alias || []).includes(command)
            : true,
        )
        .map(b => [
          b.alias ? [b.name].concat(b.alias).join('\n') : b.name,
          b.description,
          [].concat(b.usage || b.name).join('\n'),
        ])
        .sort((a: string[], b: string[]) => (a[0] < b[0] ? -1 : 1)),
    );
    session.print(t.toString());
  }

  @ShellCommand({
    name: 'exit',
    alias: ['logout'],
    description: 'Destroy current session',
  })
  async exit(args, session: ShellSession) {
    await session.destroy();
    return 0;
  }

  @ShellCommand({
    name: 'msg',
    description: 'Send a message to logged users in emulator.',
    usage: ['msg <message>', 'msg message --users=user1,user2'],
  })
  async msg({ _: [bin, message], users = null }, session: ShellSession) {
    if (!message) return session.run(`help ${bin}`);
    if (typeof users === 'string') users = users.split(',')

    const sessions = Array.isArray(users)
      ? session.sh.sessions.filter(s => users.includes(s.user))
      : session.sh.sessions;

    sessions.forEach(s => s.print(`Message From ${session.user}: ${message}`, '\n', true))
  }
}
