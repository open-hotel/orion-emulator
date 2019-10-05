import { store } from './store'
import { Socket } from '@open-hotel/core'
import Vue from 'vue'

const writes = (type: string) => (...text: string[]) => store.dispatch('writel', { type, text: text.join(' ') })
const info = writes('info')
const warn = writes('warning')
const error = writes('error')

const emitter = new Vue()

export const getSocket = async () => {
    info('Trying to open socket...')
    const socket = new Socket(process.env.SOCKET_URL)
    try {
        await socket.connect()
    } catch (e) {
        console.log(e)
        error('Socket error')
        return
    }

    info('Socket successfully open.')

    // ws.onclose = async (e) => {
    //     error('Closed with status ' + e.code)
    //     await new Promise(r => setTimeout(r, 3000))
    //     getSocket()
    // }
}
