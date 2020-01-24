import { Injectable } from "@nestjs/common";
import { ShellService, ShellCommand } from "..";
import png from 'console-png'
import path from 'path'
import { readFileSync } from 'fs'
import { ShellSession } from "../shell/providers/session";
import { Emulator } from "../lib";
import { VERSION, ASSETS_DIR } from "../lib/constants";

@Injectable()
export class BannerProvider {
  @ShellCommand({
    name: 'about',
    description: 'About Emulator',
  })
  async start (args, session:ShellSession) {
    const banner = await this.getImage()
    session.println('')
    session.println(banner)
    session.println(`
Orion Emulator v${VERSION}
https://github.com/open-hotel/orion-emulator
Developed with \x1b[31m<3\x1b[0m by Open Hotel
`)
  }

  getImage (): Promise<string> {
    return new Promise((resolve, reject) => {
      png(readFileSync(path.join(ASSETS_DIR, 'banner.png')), (e, str) => {
        if (e) return reject(e)
        resolve(str)
      })
    })  
  }
}