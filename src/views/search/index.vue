<template>
  <div class="goods" >
    <div class="nav-subs">
      <div class="nav-sub-bgs"></div>
      <div class="nav-sub-wrappers">
        <div class="w">
          <ul class="nav-lists">
            <li>
              <router-link to="/">
                <a>首页</a>
              </router-link>
            </li>
            <li>
              <a class="active">搜索结果</a>
            </li>
            <li>
              <a v-if="searching === true">拼命搜索中...</a>
              <a v-if="searching === false">共为您找到 {{total}} 款商品信息</a>
            </li>
          </ul>
          <div></div>
        </div>
      </div>
    </div>
    <div class="nav">
      <div class="w">
        <a href="javascript:;" :class="{active:sortType===0}" @click=" sortType = 0 ; reset()">综合排序</a>
        <a href="javascript:;" :class="{active:sortType===1}" @click=" sortType = 1 ;reset()">新品优先</a>
        <a href="javascript:;" :class="{active:sortType===2}" @click=" sortType = 2 ;reset()">销量</a>
        <a href="javascript:;" @click=" sortType = 3 ;reset()" :class="{active:sortType===3}">价格从低到高</a>
        <a href="javascript:;" @click="sortType = 4 ;reset()" :class="{active:sortType===4}">价格从高到低</a>
      </div>
    </div>

    <div v-loading="loading" element-loading-text="加载中..." style="min-height: 35vw;">
      <div  class="img-item" v-if="!noResult" >
        <!--商品-->
        <div class="goods-box w">
          <mall-goods v-for="(item,i) in searchResult" :key="i" :products=item></mall-goods>
        </div>

        <el-pagination
            v-if="!noResult&&!error"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[8, 20, 40, 80]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
      <div class="no-info" v-if="noResult" >
        <div class="no-data">
          <img src="/static/images/no-search.png">
          <br> 抱歉！没有为您找到相关的商品
        </div>
        <section class="section">
          <m-shelf title="为你推荐">
            <template v-slot:content>
              <div class="recommend">
                <mall-goods :products=item v-for="(item,i) in recommendList" :key="i"></mall-goods>
              </div>
            </template>
          </m-shelf>
        </section>
      </div>
      <div class="no-info" v-if="error">
        <div class="no-data">
          <img src="/static/images/error.png">
          <br> 抱歉！出错了...
        </div>
        <section class="section">
          <m-shelf title="为你推荐">
            <div slot="content" class="recommend">
              <mall-goods :products=item v-for="(item,i) in recommendList" :key="i"></mall-goods>
            </div>
          </m-shelf>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import {search as searchProduct} from "@/api/home";
import {recommendProductList} from "@/api/home";
import MShelf from "@/components/Shelf";
import MallGoods from "@/components/MallGoods";
export default {
  components:{
    MShelf,
    MallGoods
  },
  data(){
    return{
      noResult:false,
      key: '',
      searching: true,
      loading:true,
      sortType:0,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      searchResult:[],
      recommendList:[]
    }
  },

  methods:{
    reset(){
      this.currentPage = 1
      this.getSearch()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getSearch()
      this.loading = true
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSearch()
      this.loading = true
    },
    getRecommend(){
      let params ={pageNum: 1 ,pageSize: 4};
      recommendProductList(params).then(res=>{
        this.recommendList = res.data
      })
    },
    getSearch (){
      this.loading = true;
      this.noResult = true
      let params ={
        keyword: this.key,
        pageNum: this.currentPage - 1,
        pageSize: this.pageSize,
        sort: this.sortType
      }
      searchProduct(params).then(res=>{
        this.total = res.data.total;
        this.searchResult = res.data.list;
        if(this.total > 0) this.noResult = false;
        this.loading = false;
        this.searching = false;
      })
    }
  },

  mounted () {
    this.key =this.$route.query.key;
    this.getSearch();
    this.getRecommend();
  },
  name: "index"
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/mixin";
@import "../../assets/style/theme";

.nav {
  height: 60px;
  line-height: 60px;
  > div {
    display: flex;
    align-items: center;
    a {
      padding: 0 15px;
      height: 100%;
      @extend %block-center;
      font-size: 12px;
      color: #999;
      &.active {
        color: #5683EA;
      }
      &:hover {
        color: #5683EA;
      }
    }
    input {
      @include wh(80px, 30px);
      border: 1px solid #ccc;
    }
    input + input {
      margin-left: 10px;
    }
  }
}

.goods-box {
  > div {
    float: left;
    border: 1px solid #efefef;
  }
}

.nav-subs {
  position: relative;
  margin-top: -40px;
  z-index: 20;
  height: 90px;
  background: #f7f7f7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .04);
  .nav-sub-wrappers {
    padding: 31px 0;
    height: 90px;
    position: relative;
  }
  .w {
    display: flex;
    justify-content: space-between;
  }
  .nav-lists {
    height: 28px;
    line-height: 28px;
    display: flex;
    align-items: center;
    height: 100%;
    li:first-child {
      padding-left: 0;
      a {
        padding-left: 10px;
      }
    }
    li {
      position: relative;
      float: left;
      padding-left: 2px;
      a {
        display: block;
        // cursor: default;
        padding: 0 10px;
        color: #666;
        &.active {
          font-weight: bold;
        }
      }
      a:hover {
        color: #5683EA;
      }
    }
    li:before {
      content: ' ';
      position: absolute;
      left: 0;
      top: 13px;
      width: 2px;
      height: 2px;
      background: #bdbdbd;
    }
  }
}

.no-info {
  padding: 100px 0;
  text-align: center;
  font-size: 30px;
  display: flex;
  flex-direction: column;
  .no-data{
    align-self: center;
  }
}

.section {
  padding-top: 8vw;
  margin-bottom: -5vw;
  width: 1218px;
  align-self: center;
}

@media (min-width: 1px) {
  .nav-subs .nav-sub-wrappers:after {
    display: block;
  }
}

.recommend {
  display: flex;
  > div {
    flex: 1;
    width: 25%;
  }
}

.img-item{
  display: flex;
  flex-direction: column;
}

.el-pagination{
  align-self: flex-end;
  margin: 3vw 10vw 2vw;
}


</style>