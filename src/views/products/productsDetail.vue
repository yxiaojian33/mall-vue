<template>
  <div class="w store-content">
    <div class="gray-box">
      <div class="gallery-wrapper">
        <div class="gallery">
          <div class="thumbnail">
            <ul>
              <li v-for="(item,i) in small" :key="i" :class="{on:big===item}" @click="big=item">
                <img :src="item"  :alt="details.product.name">
              </li>
            </ul>
          </div>
          <div class="thumb">
            <div class="big">
              <img :src="big" :alt="details.product.name">
            </div>
          </div>
        </div>
      </div>
      <div class="banner">
        <div class="sku-custom-title">
          <h4>{{details.product.name}}</h4>
          <h6>
            <span>{{details.product.subTitle}}</span>
            <span class="price">
              <em>¥</em><i>{{Number(skuStockt.price).toFixed(2)}}</i></span>
          </h6>
          <h3>
            <ul>
              <li v-for="item in details.productFullReductionList" :key = "item.id">
               <span style="color: #e25147 ;font-weight: bold"> 满{{item.fullPrice}} 减 {{item.reducePrice}}元</span>
              </li>
            </ul>

          </h3>
        </div>
        <div class="num">
          <span class="params-name">数量</span>
          <el-input-number v-model="editNum"  :min="1" :max="10" label="描述文字"></el-input-number>
<!--          <buy-num @edit-num="editNum" :limit="Number(details.product.promotionPerLimit)"></buy-num>-->
        </div>

        <ul>
          <li v-for="(item,i) in details.productAttributeList">
            <span class="params-name">{{ item.name }}</span>
            <el-radio-group  v-model="radio[i]" :disabled="item.type ===1" size="mini">
              <template v-if="productAttributeMap[item.id] && productAttributeMap[item.id].value && productAttributeMap[item.id].value.length > 0">
                <el-radio-button  v-for="(attr,j) in productAttributeMap[item.id].value" :label="attr" :key="j" ></el-radio-button>
              </template>
              <template v-else-if="item.inputList">
                <el-radio-button disabled  v-for="(attr,j) in item.inputList.split(',')" :label="attr" :key="j" ></el-radio-button>
              </template>
            </el-radio-group>
          </li>
          <li>
            <span class="params-name">规格</span>
            <el-select v-model="skuStockt" placeholder="请选择">
              <el-option v-for="(attr,j) in details.skuStockList" :label="spData(attr.spData)" :value="attr" :key="j">
              </el-option>
            </el-select>
<!--            <el-radio-group v-model="skuStockt">-->

<!--              <el-radio-button  v-for="(attr,j) in details.skuStockList" :label="attr" :key="j" >-->
<!--                {{attr.spData}}-->
<!--              </el-radio-button>-->
<!--            </el-radio-group>-->

          </li>

        </ul>


        <div class="buy">
          <el-button type="primary" @click='addCart(details.product.id ,details.product.price,details.product.name,details.product.pic)'>加入购物车</el-button>
          <el-button type="danger">现在购买</el-button>
        </div>
      </div>
    </div>
    <!--产品信息-->
    <div class="item-info">
      <m-shelf title="产品信息">
        <template v-slot:content>
          <div class="img-item" v-if="details.product.detailHtml">
            <div v-html="details.product.detailHtml"></div>
          </div>
          <div class="no-info" v-else>
            <img src="/static/images/no-data.png">
            <br>
            该商品暂无内容数据
          </div>
        </template>
      </m-shelf>
    </div>
  </div>
</template>

<script>

import {detail as getProductDetail} from '@/api/home'
import {addToCart} from '@/api/cartitems'
import { mapState,mapMutations } from "vuex";
import MShelf from '@/components/Shelf'
export default {

  name: "productsDetail",
  computed: {
    ...mapState(["login" ,"showCart"])
  },
  components:{
    MShelf
  },
  data(){
    return{
      skuStockt: {},
      productId:'',
      big: '',
      radio:[],
      small: [],
      productAttributeMap:[],
      productAttribute:{
        id: 228,
        productAttributeId: 43,
        productId: 26,
        value: ["金色","银色"]
      },
      skuStockListMap:new Map(),
      editNum:0,
      details:{
        product: {},
        brand: {},
        productAttributeList: [],
        productFullReductionList:[],
        productAttributeValueList: [],
        skuStockList: [],
        couponList: []
      }
    }
  },

  methods:{
    ...mapMutations(['ADDCART']),

    spData(spData){
      let obj  =JSON.parse(spData);
      let attr = obj.map(x=>{
        return x.key + ":" + x.value
      })
      return attr.join(",")
    },
    addCart(id ,price ,name ,img){
      if(this.login){
        let params ={
          productId: id,
          price : this.skuStockt.price,
          productSkuId : this.skuStockt.id,
          quantity : this.editNum
        }
        addToCart(params).then(res=>{
            if(res.code ===200){
              this.ADDCART({
                id : res.data,
                productId:id,
                price:this.skuStockt.price,
                productName:name,
                productPic:img
              })
            }
        })
      }
      else this.ADDCART({
        id : id,
        productId:id,
        price:price,
        productName:name,
        productPic:img
      })
    },
    getDetails(){
      getProductDetail(this.productId).then(res=>{
          this.details = res.data;
          let str = this.details.product.albumPics;
          if(str ==="") this.small=[];
          else this.small = str.split(',');
          this.small.push(this.details.product.pic)
          if(this.details.skuStockList && this.details.skuStockList.length > 0){
            this.skuStockt = this.details.skuStockList[0]
          }
          this.details.productAttributeValueList.forEach(item=>{
           if(item.value){
             item.value = item.value.split(",")
             this.productAttributeMap[item.productAttributeId] = item;
           }
          })
          this.details.productAttributeList.forEach((item,i)=>{ //设置默认选中
            let tmp = this.productAttributeMap[item.id];
            if(tmp && tmp.value) this.radio[i] =tmp.value[0]
            else this.radio[i] = item.inputList.split(",")[0]
          })
          this.details.skuStockList.forEach((item , i)=>{
           this.skuStockListMap.set(item.spData ,item);
          })
          this.big = this.small[0]
          console.log(this.small)
      })
    }
  },
  async mounted () {
    this.productId =this.$route.query.productId;
    this.getDetails()
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/style/mixin";

.store-content {
  clear: both;
  width: 1220px;
  min-height: 600px;
  padding: 0 0 25px;
  margin: 0 auto;
}

.gray-box {
  display: flex;
  padding: 60px;
  margin: 20px 0;
  .gallery-wrapper {
    .gallery {
      display: flex;
      width: 540px;
      .thumbnail {
        li:first-child {
          margin-top: 0px;
        }
        li {
          @include wh(80px);
          margin-top: 10px;
          padding: 12px;
          border: 1px solid #f0f0f0;
          border: 1px solid rgba(0, 0, 0, .06);
          border-radius: 5px;
          cursor: pointer;
          &.on {
            padding: 10px;
            border: 3px solid #ccc;
            border: 3px solid rgba(0, 0, 0, .2);
          }
          img {
            display: block;
            @include wh(100%);
          }
        }
      }
      .thumb {
        .big {
          margin-left: 20px;
        }
        img {
          display: block;
          @include wh(440px)
        }
      }
    }
  }
  // 右边
  .banner {
    width: 450px;
    margin-left: 10px;
    h4 {
      font-size: 24px;
      line-height: 1.25;
      color: #000;
      margin-bottom: 13px;
    }
    h6 {
      font-size: 14px;
      line-height: 1.5;
      color: #bdbdbd;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sku-custom-title {
      overflow: hidden;
      padding: 8px 8px 18px 10px;
      position: relative;
    }
    .params-name {
      padding-right: 20px;
      font-size: 14px;
      color: #8d8d8d;
      line-height: 36px;
    }
    .num {
      padding: 29px 0 8px 10px;
      border-top: 1px solid #ebebeb;
      display: flex;
      align-items: center;
    }
    .buy {
      position: relative;
      border-top: 1px solid #ebebeb;
      padding: 30px 0 0 10px;
    }
  }
}

.item-info {

  .gray-box {
    padding: 0;
    display: block;
  }
  .img-item {
    width: 1220px;
    // padding: 1vw;
    text-align: center;
    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }
}

.no-info {
  padding: 200px 0;
  text-align: center;
  font-size: 30px;
}

.price {
  display: block;
  color: #d44d44;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  text-align: right;
  i {
    padding-left: 2px;
    font-size: 24px;
  }
}

</style>