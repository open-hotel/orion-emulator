import { performance } from 'perf_hooks';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ShellProvider, ShellSession } from './shell.provider';
import ora = require('ora');
import ms from 'ms';
import { ShellServiceBin } from '../types';
import { ShellCommand } from '../decorators';
import CliTable3 = require('cli-table3');

@Injectable()
export class ShellServicesProvider implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    this.services = {
      ...this.services,
      ...ShellServicesProvider.preparedServices,
    };

    ShellServicesProvider.preparedServices = {};
  }

  private static preparedServices: {
    [key: string]: ShellServiceBin;
  } = {};

  private services: {
    [key: string]: ShellServiceBin;
  } = {};

  static prepare(command: ShellServiceBin) {
    this.preparedServices[command.name] = command;
    return this;
  }

  register(command: ShellServiceBin) {
    this.services[command.name] = command;
    return this;
  }

  get(name: string) {
    const command = this.services[name];
    if (!command) throw new Error('Service Not Found!');
    return command;
  }

  async boot(session: ShellSession, shutdown = false) {
    const loader = ora();

    const services = Object.values(this.services)
      .filter(service => service.boot)
      .sort((a, b) => {
        if ([].concat(b.after).includes(a.name)) return -1;
        if ([].concat(b.before).includes(a.name)) return 1;
        return 0;
      });

    if (shutdown) {
      const start = performance.now();
      services.reverse();

      for (const service of services) {
        await this.callService(service, 'stop', session, loader);
      }

      const time = Math.round(performance.now() - start);

      loader.succeed(`Shutdown finished\t+${ms(time)}`);

      return true;
    }

    const start = performance.now();

    for (const service of services) {
      await this.callService(service, 'start', session, loader);
    }

    const time = Math.round(performance.now() - start);
    loader.succeed(`Orion Emulator is Ready! \t+${ms(time)}`);
  }

  @ShellCommand({
    name: 'shutdown',
    alias: ['poweroff'],
    description: 'Shutdown Emulator',
    usage: ['shutdown', 'poweroff'].join('\n'),
  })
  async shutdown(args: any, session: ShellSession) {
    session.sh.sessions.forEach(s => s !== session && s.destroy());
    await this.boot(session, true);
    session.destroy();
    process.exit();
  }

  @ShellCommand({
    name: 'services',
    description: 'Manages background services',
    usage: [
      'services start <name>',
      'services stop <name>',
      'services restart <name>',
      'services list',
      'services help',
    ].join('\n'),
  })
  async servicesCmd(
    { _: [bin, action = 'help', name] },
    session: ShellSession,
  ) {
    if (action === 'list') return this.listCmd(session);
    if (action === 'start' || action === 'stop') {
      return this.callService(name, action, session);
    }
    if (action === 'restart') {
      await this.callService(name, 'stop', session);
      return this.callService(name, 'start', session);
    }
    return session.run(`help ${bin}`);
  }

  private listCmd(session: ShellSession) {
    const items = Object.values(this.services);
    const table = new CliTable3({
      head: ['Name', 'Description'],
    });

    table.push(
      // @ts-ignore
      ...items.map(s => [
        [s.name].concat(s.alias || []).join('\n'),
        s.description || '-',
      ]),
    );

    session.println(table.toString());
  }

  private async callService(
    service: string | ShellServiceBin,
    action: 'start' | 'stop' | 'restart',
    session: ShellSession,
    loader: ora.Ora = ora(),
  ) {
    const serviceBin =
      typeof service === 'string' ? this.services[service] : service;
    if (!serviceBin) return session.error('Service not found!');

    const start = performance.now();
    if (!serviceBin.quiet) {
      const text =
        action === 'start'
          ? `\x1b[2mStarting ${serviceBin.title}...\x1b[0m`
          : `\x1b[2mStopping ${serviceBin.title}...\x1b[0m`;
      loader.start(text);
    }
    const execution = session
      .run(serviceBin.main, false, { _: [serviceBin.name, action] })
      .then(() => {
        if (!serviceBin.quiet) {
          const time = Math.round(performance.now() - start);
          const text =
            action === 'start'
              ? `\x1b[32mStarted ${serviceBin.title}\x1b[0m\t+${ms(time)}`
              : `\x1b[32mStopped ${serviceBin.title}\x1b[0m\t+${ms(time)}`
          loader.succeed(text);
        }
      })
      .catch(err => {
        const time = Math.round(performance.now() - start);
        loader.fail(
          `\x1b[31;1mError in "${serviceBin.title}" service\t+${ms(
            time,
          )}\n  \x1b[1mError:\x1b[0m \x1b[31m${err.message}\x1b[0m`,
        );
      });

    if (!serviceBin.async) await execution;
  }
}
