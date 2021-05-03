<template>
  <m-header></m-header>
  <router-view></router-view>
</template>

<script>
import MHeader from '@/common/header'
export default {
  components:{
    MHeader
  },
  name: "index.vue"
}
</script>

<style scoped>

</style>