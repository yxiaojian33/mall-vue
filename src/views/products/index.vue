<template>
<div class="main-scroll" >
    <div class="infinite-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10"   style="overflow:auto">
      <mall-goods class="hot" v-for="item in hotProductList" :products="item">
      </mall-goods>
    </div>
</div>
</template>

<script>
import {hotProductList as hotProducts} from '@/api/home'
import MallGoods from "@/components/MallGoods";
export default {
  components:{
    MallGoods
  },
  data () {
    return {
      hotProductList:[],
      page : 0,
      size : 10,
      busy: false
    }
  },
  methods: {
    loadMore () {
      this.page =1;
      let params ={pageNum: this.page ,pageSize:this.size}
      this.busy = true;
      hotProducts(params).then(res=>{
        for(let i = 0;i<res.data.length;i++){
          this.hotProductList.push(res.data[i])
        }
      })
      this.busy = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.hot {
  display: flex;
  float: left;
  > div {
    flex: 1;
    width: 25%;
  }
}
.main-scroll{
  height: 800px;
  margin-bottom: 1px;
}
.infinite-list{
  width: 1220px;
  height: 100%;
  margin: 0 auto 40px;
}
</style>