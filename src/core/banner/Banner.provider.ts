import { Injectable } from "@nestjs/common";
import { ShellService, ShellSession, ShellCommand } from "..";
import png from 'console-png'
import path from 'path'
import { readFileSync } from 'fs'
import { version } from "../../../package.json";

@Injectable()
export class BannerProvider {
  @ShellService({
    name: 'banner',
    title: 'Banner',
    boot: true,
    quiet: true
  })
  service (args, session:ShellSession) {
    if (args._[1] === 'start') return this.start(args, session)
  }

  @ShellCommand({
    name: 'about',
    description: 'About Emulator',
  })
  async start (args, session:ShellSession) {
    const banner = await this.getImage()
    session.println('')
    session.println(banner)
    session.println(`
Orion Emulator v${version}
https://github.com/open-hotel/orion-emulator
Developed with \x1b[31m<3\x1b[0m by Open Hotel
`)
  }

  getImage (): Promise<string> {
    return new Promise((resolve, reject) => {
      png(readFileSync(path.resolve(__dirname, '../../../../src/core/banner/banner2.png')), (e, str) => {
        if (e) return reject(e)
        resolve(str)
      })
    })  
  }
}