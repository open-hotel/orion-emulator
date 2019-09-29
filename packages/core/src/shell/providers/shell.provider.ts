import * as readline from 'readline';
import YargsParser from 'yargs-parser';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ShellCommandProvider } from './commands.provider';
import { ShellServicesProvider } from './services.provider';

@Injectable()
export class ShellProvider implements OnApplicationBootstrap {
  private ignoreNextCommand = false

  constructor (
    private bin: ShellCommandProvider,
    private service: ShellServicesProvider,
  ) {
    process.on('uncaughtException', (error) => {
      this.ignoreNextCommand = true
      this.error(error)
    })

    process
    .on('exit', () => this.run('shutdown'))
    .on('SIGINT', () => this.run('shutdown'))

    this.rl.on('SIGINT', () => this.run('shutdown'))
  }

  public rl: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `\x1b[36;1mOrion > \x1b[0m`,
    terminal: true,
    removeHistoryDuplicates: true,
  });

  prompt(prompt?: string): Promise<string> {
    return new Promise(resolve => {
      if (prompt) this.rl.setPrompt(prompt);
      this.rl.prompt();
      this.rl.once('line', input => resolve(input));
    });
  }

  print(data: string | Buffer, newLine = true) {
    this.rl.write(data);
    newLine && this.rl.write('\n');
  }

  error(errorOrString: string | Error) {
    const message =
      typeof errorOrString === 'string' ? errorOrString : errorOrString.message;
    this.print(`\x1b[31mError: ${message}\x1b[0m`);
    return 1;
  }

  async run(cmd: string|Function, catchErrors = true, args?): Promise<number> {
    if (this.ignoreNextCommand) {
      cmd = ''
      this.ignoreNextCommand = false
    }
    if (!cmd) return 0;

    let result = null

    try {
      if (typeof cmd === 'string') {
        const args = YargsParser(cmd);
        const [binName] = args._;
        const command = this.bin.get(binName)
  
        result = command.main(args, this)
      } else if (typeof cmd === 'function') {
        result = cmd(args, this)
      }

      const exitCode = await result

      return typeof exitCode === 'number' ? result : 0;
    } catch (err) {
      if (catchErrors) return this.error(err)
      throw err
    }
  }

  async start() {
    await this.service.boot(this)

    while (true) {
      const cmd = await this.prompt();
      await this.run(cmd);
    }
  }

  async onApplicationBootstrap() {
    setImmediate(() => this.start());
  }
}
