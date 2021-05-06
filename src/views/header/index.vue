<template>
  <div>
    <m-header>
      <template v-slot:nav>
        <div class="nav"></div>
      </template>
    </m-header>
    <router-view style="margin-top: 40px;"></router-view>
  </div>
</template>
<script>
  import MHeader from '@/common/header'
  export default {
    components: {
      MHeader,
    }
  }
</script>
