import { ShellCommand } from "./decorators"
import CliTable3 = require("cli-table3")
import { Injectable } from "@nestjs/common"
import { ShellProvider } from "../shell"

@Injectable()
export class DefaultCommands {
  @ShellCommand({
    name: 'help',
    usage: 'help [command]'
  })
  help ({ _: [bin, command]}, sh: ShellProvider) {
    const t = new CliTable3({
      head: ['Command', 'Description', 'Usage']
    })

    //@ts-ignore
    t.push(...sh.bin.binsWithoutAliases
      .filter(b => command ? (b.name === command || (b.alias || []).includes(command)) : true)
      .map((b) => [
      (b.alias ? [b.name].concat(b.alias).join('\n') : b.name),
      b.description,
      b.usage || b.name
    ]).sort((a:string[], b:string[]) => a[0] < b[0] ? -1 : 1))
    sh.print(t.toString())
  }
}