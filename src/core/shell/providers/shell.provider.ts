import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ShellCommandProvider } from './bin.provider';
import { ShellServicesProvider } from './services.provider';
import yargs from 'yargs-parser';
import { ShellSession } from './session';
import { Stdout } from '../../lib/Stdout';
import { VERSION } from '../../lib/constants';

@Injectable()
export class ShellProvider implements OnApplicationBootstrap {
  public ignoreNextCommand = false;
  public sessions: ShellSession[] = [];

  constructor(
    public bin: ShellCommandProvider,
    public service: ShellServicesProvider,
  ) {
    process.on('uncaughtException', error => {
      console.error(error)
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
    session.println(`\nOrion Emulator v${VERSION}\n`)
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
