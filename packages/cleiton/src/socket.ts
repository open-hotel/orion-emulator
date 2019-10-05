import { store } from './store'
console.log(store)
const writes = (type: string) => (...text: string[]) => store.dispatch('writel', { type, text: text.join(' ') })
const info = writes('info')
const warn = writes('warning')
const error = writes('error')

export const getSocket = async () => {
    info('Trying to open socket...')
    const ws = new WebSocket(process.env.SOCKET_URL)
    ws.onopen = () => {
        info('Socket successfully open.')
    }

    ws.onerror = () => {
        error('Socket error')
    }

    ws.onclose = async (e) => {
        error('Closed with status ' + e.code)
        await new Promise(r => setTimeout(r, 3000))
        getSocket()
    }

    return ws
}
