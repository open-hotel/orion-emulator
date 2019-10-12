import 'xterm/css/xterm.css'

import { Terminal } from 'xterm'
import { AttachAddon } from 'xterm-addon-attach'
import { FitAddon } from 'xterm-addon-fit'

const ws = new WebSocket('ws://localhost:23456')
ws.binaryType = 'arraybuffer';

const term = new Terminal()
const fit = new FitAddon()
const attach = new AttachAddon(ws, {
  bidirectional: true,
  inputUtf8: true
})

term.loadAddon(fit)
term.loadAddon(attach)
term.open(document.body)

ws.addEventListener('open', () => {
  term.write(`\nConnected!\n\n`)
})
ws.addEventListener('close', () => {
  term.write(`\nDisconnected!\n\n`)
})

fit.fit()