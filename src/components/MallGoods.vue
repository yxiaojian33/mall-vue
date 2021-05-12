<template>
  <el-row class="good-item">
    <el-col>
      <div :body-style="{padding: 0}">
        <div class="good-img">
          <a>
            <img :src="products.pic" alt lazy>
          </a>
        </div>
        <h6 class="good-title">{{products.name}}</h6>
        <h3 class="sub-title ellipsis">{{products.subTitle}}</h3>
        <div class="good-price pr">
          <div class="ds pa">
            <a href='javascript:;'>
              <el-button type="default" size="medium" @click="productDetail(products.id)">查看详情</el-button>
            </a>
            <a href="javascript:;">
              <el-button
                type="primary"
                size="medium"
                @click="addCart(products.id,products.price,products.name,products.pic)"
              >加入购物车</el-button>
            </a>
          </div>
          <p>
            <span style="font-size:14px">¥</span>
            {{Number(products.price).toFixed(2)}}
          </p>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { mapState,mapMutations } from "vuex";
import { addToCart } from "@/api/cartitems";
import { getStore } from "@/utils/storage";
export default {
  props: ["products"],
  computed: {
    ...mapState(["login" ,"showCart"])
  },
  methods: {
    ...mapMutations(['ADDCART']),
    productDetail(id) {
      // 编程式导航
      this.$router.push({
        path:'/productsDetail',
        query:{
          productId:id
        }
      });
    },
    addCart(id, price, name, img) {
      if (this.login) {
        let params ={
          productId: id,
          price: price ,
          quantity : 1
        }
        addToCart(params).then(res=>{
          if(res.code ===200){
            this.ADDCART({
              id : res.data,
              productId:id,
              price:price,
              productName:name,
              productPic:img
            })
          }
        })

      }else{
        // 如果用户未登录 也要将商品存储到store的cartList
        this.ADDCART({
          id : id,
          productId:id,
          price:price,
          productName:name,
          productPic:img
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.good-img {
  display: flex;
  justify-content: center;
  a {
    display: block;
    img {
      margin: 50px auto 10px;
      width: 206px;
      height: 206px;
      display: block;
    }
  }
}
.good-price {
  width: 100%;
  position: absolute;
  bottom: 0;
  margin: 15px 0;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: #d44d44;
  font-family: Arial;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  justify-content: space-around;
  padding-bottom: 43px;
  a {
    margin-right: 5px;
  }
  .ds {
    display: none;
  }
}
.good-price:hover .ds {
  display: block;
}
.good-title {
  line-height: 1.2;
  font-size: 16px;
  color: #424242;
  margin: 0 auto;
  padding: 0 14px;
  text-align: center;
  overflow: hidden;
}
h3 {
  text-align: center;
  line-height: 1.2;
  font-size: 12px;
  color: #d0d0d0;
  padding: 10px;
}
.good-item {
  background: #fff;
  width: 25%;
  transition: all 0.5s;
  height: 410px;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 1px 1px 20px #999;
    .good-price p {
      display: none;
    }
    .ds {
      display: flex;
    }
  }
}
.el-card {
  border: none;
}
</style>