import { ShellProvider } from '../providers/shell.provider';
import { Arguments } from 'yargs';

export type PromiseOr<T> = Promise<T> | T;

export interface GenericBin {
  name: string;
  alias?: string[];
  description?: string;
  main?: (args: Arguments, shell: ShellProvider) => PromiseOr<number | void>;
}

export interface ShellBin extends GenericBin {
  usage?: string;
}

export interface ShellServiceBin extends GenericBin {
  title?: string;
  boot?: boolean;
  async?: boolean;
  before?: string | string[];
  after?: string | string[];
}
