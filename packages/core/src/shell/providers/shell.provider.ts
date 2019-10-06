import * as readline from 'readline';
import YargsParser from 'yargs-parser';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ShellCommandProvider } from './commands.provider';
import { ShellServicesProvider } from './services.provider';

const users = {
  root: 'root',
  salomaosnff: 'salomaosnff'
};

export class ShellSession {
  rl: readline.Interface;
  user: string;
  alive = false;

  constructor(
    input: NodeJS.ReadStream,
    output: NodeJS.WriteStream,
    public sh: ShellProvider,
    private onDestroy = () => {}
  ) {
    this.rl = readline.createInterface({
      input,
      output,
      prompt: `\x1b[36;1mOrion > \x1b[0m`,
      terminal: true,
      removeHistoryDuplicates: true,
    });

    this.rl.on('SIGINT', () => this.exit());
  }

  run(cmd: string | Function, catchErrors = true, args?) {
    return this.sh.run(this, cmd, catchErrors, args)
  }

  exit() {
    this.destroy();
  }

  async login() {
    const user = await this.question('User: ');
    const password = await this.question('Password: ');

    if (!(user in users) || password !== users[user]) {
      this.error('Invalid Credentials!');
      return this.login();
    }

    this.user = user
    this.alive = true;

    return true;
  }

  destroy() {
    this.rl.write('\n')
    this.onDestroy()
    this.rl.close();
    this.sh.removeSession(this);
    this.alive = false;
  }

  question(question: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(question, resolve);
    });
  }

  prompt(prompt?: string): Promise<string> {
    return new Promise(resolve => {
      if (prompt) this.rl.setPrompt(prompt);
      this.rl.prompt();
      this.rl.once('line', input => resolve(input));
    });
  }

  print(data: string | Buffer, end = '\n', ignoreCommand = true) {
    this.sh.ignoreNextCommand = ignoreCommand
    this.rl.write(data);
    this.rl.write(end);

    return this;
  }

  error(errorOrString: string | Error) {
    const message =
      typeof errorOrString === 'string' ? errorOrString : errorOrString.message;
    this.print(`\x1b[31mError: ${message}\x1b[0m`);
    return 1;
  }
}

@Injectable()
export class ShellProvider implements OnApplicationBootstrap {
  public ignoreNextCommand = false;
  public sessions: ShellSession[] = [];

  constructor(
    private bin: ShellCommandProvider,
    private service: ShellServicesProvider,
  ) {
    process.on('uncaughtException', error => {
      this.ignoreNextCommand = true;
      this.sessions.forEach(session => session.error(error));
    });

    process
      .on('exit', () => this.run(this.sessions[0], 'shutdown'))
      .on('SIGINT', () => this.run(this.sessions[0], 'shutdown'));
  }

  async startTTY(input: NodeJS.ReadStream, output: NodeJS.WriteStream, onDestroy?) {
    const session = new ShellSession(input, output, this, onDestroy);

    this.sessions.push(session);

    await session.login();

    while (session.alive) {
      const cmd = await session.prompt();
      await session.run(cmd);
    }

    if (this.sessions.length < 1) await session.run('shutdown');
  }

  removeSession(session: ShellSession) {
    const index = this.sessions.indexOf(session);
    if (index > -1) this.sessions.splice(index, 1);
    return this;
  }

  async run(
    session: ShellSession,
    cmd: string | Function,
    catchErrors = true,
    args?,
  ): Promise<number> {
    if (!cmd || this.ignoreNextCommand) {
      this.ignoreNextCommand = false;
      return 0;
    }

    let result = null;

    try {
      if (typeof cmd === 'string') {
        const args = YargsParser(cmd);
        const [binName] = args._;
        const command = this.bin.get(binName);

        result = command.main(args, session);
      } else if (typeof cmd === 'function') {
        result = cmd(args, session);
      }

      const exitCode = await result;

      return typeof exitCode === 'number' ? result : 0;
    } catch (err) {
      if (catchErrors) {
        this.sessions.forEach(session => session.error(err));
        return;
      }
      throw err;
    }
  }

  async start() {
    await this.service.boot(this);
    await this.startTTY(process.stdin, process.stdout);
  }

  async onApplicationBootstrap() {
    setImmediate(() => this.start());
  }
}
