import { performance } from 'perf_hooks';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ShellProvider } from './shell.provider';
import ora = require('ora');
import ms from 'ms';
import { ShellServiceBin } from '../types';
import { ShellCommand } from '../decorators';

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

  async boot(sh: ShellProvider, shutdown = false) {
    const loader = ora()

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

      for (let service of services) {
        const start = performance.now();
        await sh
          .run(service.main, false, { _: [service.name, 'stop'] })
          .then(() => {
            const time = Math.round(performance.now() - start);
            loader.succeed(`Stopped ${service.title}\t+${ms(time)}`);
          })
          .catch(err => {
            const time = Math.round(performance.now() - start);
            loader.fail(
              `${service.title}\t+${ms(time)}\n  Error: ${err.message}`,
            );
          });
      }
      const time = Math.round(performance.now() - start);
      loader.succeed(`Shutdown finished\t+${ms(time)}`)
      return true;
    }

    const start = performance.now();
    for (let service of services) {
      const start = performance.now();
      loader.start(`\x1b[2mStarting ${service.title}...\x1b[0m`);
      const execution = sh
        .run(service.main, false, { _: [service.name, 'start'] })
        .then(() => {
          const time = Math.round(performance.now() - start);
          loader.succeed(`\x1b[32mStarted ${service.title}\x1b[0m\t+${ms(time)}`);
        })
        .catch(err => {
          const time = Math.round(performance.now() - start);
          loader.fail(
            `\x1b[31;1mFailed to start ${service.title}\t+${ms(
              time,
            )}\n  \x1b[1mError:\x1b[0m \x1b[31m${err.message}\x1b[0m`,
          );
        });

      if (!service.async) await execution;
    }

    const time = Math.round(performance.now() - start);
    loader.succeed(`Orion Emulator is Ready! \t+${ms(time)}`)
  }

  @ShellCommand({
    name: 'shutdown',
    alias: ['exit', 'poweroff'],
    description: 'Shutdown Emulator',
    usage: ['shutdown', 'exit', 'poweroff'].join('\n'),
  })
  async shutdown (args: any, sh: ShellProvider) {
    await this.boot(sh, true)
    process.exit()
  }
}