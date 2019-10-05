import VueX from 'vuex'
import Vue from 'vue'
import { getSocket } from './socket'

Vue.use(VueX)

interface Message {
    text: string
    type: 'error' | 'success' | 'info' | 'warning',
    breaks: boolean
}

export const store = new VueX.Store({
    state: {
        messages: []
    },
    mutations: {
        logMessage (state, message) {
            state.messages.push(message)
        }
    },
    actions: {
        write ({ commit }, message: Message) {
            commit('logMessage', message)
        },
        writel ({ dispatch }, message: Message) {
            message.breaks = true
            dispatch('write', message)
        },
        async send () {

        }
    }
})

getSocket()

export default store
