import { Interface, createInterface } from "readline";
import yargs from 'yargs-parser';
import { ShellProvider } from "./shell.provider";
import { Stdout } from "../../lib/Stdout";

const users = {
  root: 'root',
  salomaosnff: 'salomaosnff',
};

export class ShellSession {
  rl: Interface;
  user: string;
  alive = false;

  constructor(
    public stdin: NodeJS.ReadStream,
    public stdout: Stdout,
    public sh: ShellProvider
  ) {
    this.rl = createInterface({
      input: stdin,
      output: stdout,
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
    const password = await this.password('Password: ');

    if (!(user in users) || password !== users[user]) {
      this.print('\x1b[F\x1b[K\x1b[F\x1b[K\x1b[F\x1b[K')
      this.error('Invalid Credentials!');
      return this.login();
    }

    this.user = user;
    this.alive = true;

    this.print('\x1b[F\x1b[F\x1b[F\x1b[K')
    await this.run('about')

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
  
  async password(question: string): Promise<string> {
    const mode = this.stdout.mode
    setImmediate(() => {
      this.stdout.mode = 'hidden'
    })
    const password = await this.question(question)
    this.stdout.mode = mode
    this.stdout.write('\n')
    return password
  }

  prompt(prompt = `\x1b[36;1morion (${this.user}) > \x1b[0m`): Promise<string> {
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