<template>
  <m-header></m-header>
  <router-view class="mainBody"></router-view>
</template>

<script>
import MHeader from '@/common/header'
export default {
  components:{
    MHeader,
  },
  name: "index.vue"
}
</script>

<style scoped>
.mainBody{
  height:100%;
}
</style>