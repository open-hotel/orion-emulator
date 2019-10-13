import { Injectable } from "@nestjs/common";
import { ShellService, ShellSession, ShellCommand } from "../core";
import png from 'console-png'
import path from 'path'
import { readFileSync, writeFile } from 'fs'

@Injectable()
export class BannerProvider {
  @ShellService({
    name: 'banner',
    title: 'Zingulei',
    boot: true
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
    session.println(banner)
    session.println('Orion Emulator v0.0.0')
  }

  getImage (): Promise<string> {
    return new Promise((resolve, reject) => {
      png(readFileSync(path.resolve(__dirname, '../../../packages/banner/banner2.png')), (e, str) => {
        if (e) return reject(e)
        resolve(str)
      })
    })  
  }
}