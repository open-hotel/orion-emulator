import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ShellBin } from '../types';

@Injectable()
export class ShellCommandProvider implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    this.bin = {
      ...this.bin,
      ...ShellCommandProvider.preparedBins,
    };

    ShellCommandProvider.preparedBins = {};
  }

  private static preparedBins: {
    [key: string]: ShellBin;
  } = {};

  private bin: {
    [key: string]: ShellBin;
  } = {};

  get bins () {
    return this.bin
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

  static prepare(command: ShellBin, alias = command.name) {
    this.preparedBins[alias] = command;
    return this;
  }

  register(command: ShellBin, alias = command.name) {
    this.bin[alias] = command;
    return this;
  }

  get(name: string) {
    return this.bin[name];
  }

  hasCompleter (bin:string) {
    return typeof this.bins[bin].completer === 'function'
  }

  completer (bin:string, line:string, cb?) {
    return this.bins[bin].completer(line, cb)
  }
}
