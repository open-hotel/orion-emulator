import { Transform, Writable } from "stream";

type StdoutModes = 'normal' | 'password' | 'hidden'

export class Stdout extends Writable {
  public mode:StdoutModes  = 'normal'

  constructor (public stdout: Writable) {
    super()
  }

  _write (chunk: string | Buffer, encoding:string, cb: (e?: Error) => void) {
    if (this.mode === 'hidden') return cb()

    this.stdout.write(chunk, encoding, cb)
  }
}