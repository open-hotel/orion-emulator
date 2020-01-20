import * as readline from 'readline';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ShellCommandProvider } from './bin.provider';
import { ShellServicesProvider } from './services.provider';
import yargs from 'yargs-parser';

const users = {
  root: 'root',
  salomaosnff: 'salomaosnff',
};

export class ShellSession {
  rl: readline.Interface;
  user: string;
  alive = false;

  constructor(
    public stdin: NodeJS.ReadStream,
    public stdout: NodeJS.WriteStream,
    public sh: ShellProvider
  ) {
    this.rl = readline.createInterface({
      input: stdin,
      output: stdout,
      prompt: `\x1b[36;1mOrion > \x1b[0m`,
      terminal: true,
      removeHistoryDuplicates: true,
      completer: line => {
        const args = yargs(line);
        const bin = args._[0];
        const bins = Object.keys(this.sh.bin.bins);
        const hits = bins.filter(b => b.startsWith(bin));

        if (
          bin &&
          hits.length === 1 &&
          hits[0] === bin &&
          this.sh.bin.hasCompleter(bin)
        ) {
          return this.sh.bin.completer(bin, line);
        }

        return [hits.length ? hits : bins, line];
      },
    });

    this.rl.on('SIGINT', () => this.exit());
  }

  run(cmd: string | Function, catchErrors = true, args?) {
    return this.sh.run(this, cmd, catchErrors, args);
  }

  async exit() {
    if (this.sh.sessions.length === 1) {
      await this.run('shutdown');
    } else {
      this.destroy();
    }
  }

  async login() {
    const user = await this.question('User: ');
    const password = await this.question('Password: ');

    if (!(user in users) || password !== users[user]) {
      this.error('Invalid Credentials!');
      return this.login();
    }

    this.user = user;
    this.alive = true;

    return true;
  }

  destroy() {
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

  print(data: string | Buffer) {
    this.stdout.write(data);

    return this;
  }

  println(data: string | Buffer) {
    this.stdout.write(data);
    this.stdout.write('\r\n');

    return this;
  }

  error(errorOrString: string | Error) {
    const message =
      typeof errorOrString === 'string' ? errorOrString : errorOrString.message;
    this.print(
      `\x1b[31mError: ${message}\x1b[0m\n\x1b[31m${
        errorOrString instanceof Error ? errorOrString.stack : ''
      }\x1b[0m`,
    );
    return 1;
  }
}

@Injectable()
export class ShellProvider implements OnApplicationBootstrap {
  public ignoreNextCommand = false;
  public sessions: ShellSession[] = [];

  constructor(
    public bin: ShellCommandProvider,
    public service: ShellServicesProvider,
  ) {
    process.on('uncaughtException', error => {
      this.ignoreNextCommand = true;
      this.sessions.forEach(session => session.error(error));
    });

    process
      .on('exit', () => this.run(this.sessions[0], 'shutdown'))
      .on('SIGINT', () => this.run(this.sessions[0], 'shutdown'));
  }

  createTTY(input: NodeJS.ReadStream, output: NodeJS.WriteStream) {
    const session = new ShellSession(input, output, this);
    this.sessions.push(session);
    return session;
  }

  async startTTY(session: ShellSession) {
    await session.login();

    while (session.alive) {
      const cmd = await session.prompt();
      await session.run(cmd);
    }
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
        const args = yargs(cmd);
        const [binName] = args._;
        const command = this.bin.get(binName);

        if (!command) {
          session.error(`Command not found!`)
          return 1
        }

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
    const session = await this.createTTY(process.stdin, process.stdout);
    await this.service.boot(session);
    await this.startTTY(session);
  }

  async onApplicationBootstrap() {
    setImmediate(() => this.start());
  }
}
