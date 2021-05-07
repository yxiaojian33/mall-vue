<template>
  <el-input-number v-model="num" @change="handleChange" :min="1" :max="limit" label="描述文字"></el-input-number>
</template>

<script>
export default {
  props:["limit"],
  data() {
    return {
      num: 1
    };
  },
  methods: {
    handleChange(value) {
      this.$emit('handleValue',value)
    }
  }
};
</script>

<style lang="scss" >
.el-input-number__decrease, .el-input-number__increase {
  height: 40px;
  width: 40px;
  background: #ebebeb;
  border-radius:20px;
}
</style>