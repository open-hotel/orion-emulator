import { ShellSession } from '../providers/shell.provider';
import { Arguments } from 'yargs';
import { Completer, AsyncCompleter } from 'readline';

export type PromiseOr<T> = Promise<T> | T;

export interface GenericBin {
  name: string;
  alias?: string[];
  description?: string;
  completer?: Completer | AsyncCompleter,
  main?: (args: Arguments, session: ShellSession) => PromiseOr<number | void>;
}

export interface ShellBin extends GenericBin {
  usage?: string | string[];
}

export interface ShellServiceBin extends GenericBin {
  title?: string;
  boot?: boolean;
  async?: boolean;
  before?: string | string[];
  after?: string | string[];
}
