<template>
    <div class="cleiton">
        <c-shell />
    </div>
</template>

<script>
import CShell from './components/Shell'
export default {
    components: {
        CShell
    }
}
</script>
<style lang="scss">
* {
    box-sizing: border-box;
}
body {
    margin: 0;
}
</style>
<style lang="scss" scoped>
.cleiton {
    background-color: #000;
    color: #fff;
    height: 100vh;
}
</style>