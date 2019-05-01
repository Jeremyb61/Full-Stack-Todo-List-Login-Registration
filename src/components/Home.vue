<template>
    <div>
        <Header />
        <Todos />
    </div>
</template>
<script>
import Header from './layouts/Header'
import Todos from './Todos'
export default {
    name: 'Home',
    components: {
        Header,
        Todos
    }
}

</script>
<style scoped>

</style>


