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
    const command = this.bin[name];
    if (!command) throw new Error('Command Not Found!');
    return command;
  }
}
