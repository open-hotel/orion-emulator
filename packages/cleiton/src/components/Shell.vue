<template>
    <section @click="focusInput" @mousewheel="fixOnBottom = false" class="cleiton-shell">
        <div class="shell-output">
            <span
                v-for="(message, idx) in messages"
                :style="{ display: message.breaks ? 'block' : 'inline' }"
                :class="`msg_${message.type}`"
                :key="idx"
            >
                {{ message.text }}
            </span>
        </div>
        <div class="input-wrapper">
            <span class="prefix">
                 > Cleiton Orion
            </span>
            <input
                v-model="currentText"
                ref="input"
                type="text"
                class="shell-input"
                @keydown.enter="onEnter"
            >
        </div>
    </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    data () {
        return {
            currentText: '',
            fixOnBottom: false
        }
    },
    watch: {
        async messages () {
            if (this.fixOnBottom) {
                await this.$nextTick()
                this.$el.scrollTop = this.$el.scrollHeight + 1000
            }
        }
    },
    methods: {
        onEnter () {
            this.currentText = ''
            this.send()
        },
        focusInput () {
            this.fixOnBottom = true
            this.$refs.input.focus()
        },
        ...mapActions(['send'])
    },
    computed: {
        ...mapState(['messages'])
    },
    mounted () {
        this.focusInput()
        console.log(process.env.SOCKET_URL)
    }
}
</script>

<style lang="scss" scoped>
.msg_info {
    color: #5bc0de;
}
.msg_warning {
    color: #f0ad4e;
}
.msg_success {
    color: #22BB33;
}
.msg_error {
    color: #bb2124;
}
.msg_default {
    color: #fff;
}
.prefix {
    color: #4AF626;
}
.cleiton-shell {
    font-size: 15px;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-height: 100vh;
    overflow: auto;
    padding: 10px;
    padding-bottom: 20px;
    font-family: 'Inconsolata';
    font-weight: 900;
}
.shell-input {
    background-color: #000;
    color: #fff;
    border: none;
    outline: none;
    margin-left: 5px;
}
.input-wrapper {
    display: flex;
    align-items: center;
}
.shell-output {
}
</style>