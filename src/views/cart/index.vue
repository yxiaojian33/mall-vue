<template>
  <div class="store-content page-cart">
    <div class="gray-box">
      <div class="title"><h2>购物清单</h2></div>
      <!--内容-->
      <div v-if="cartList.length">
        <div class="ui-cart">
          <div>
            <!--标题-->
            <div class="cart-table-title">
              <span class="name">商品信息</span> <span class="operation">操作</span> <span
                class="subtotal">小计</span> <span class="num">数量</span> <span class="price1">单价</span>
            </div>
            <!--列表-->
            <el-checkbox-group v-model="cartIds" @change="handleCheckedChange">
              <div class="cart-table" v-for="(item,i) in cartList" :key="i">
                <div class="cart-group divide pr" :data-productid="item.productId">
                  <div class="cart-top-items">
                    <div class="cart-items clearfix">
                      <div class="items-choose">
                        <el-checkbox class="blue-checkbox-new" :label="item.id" @change="val => {item.checked = val}">{{}}</el-checkbox>
                      </div>

                      <!--图片-->
                      <div class="items-thumb fl">
                        <img :alt="item.productName"
                             :src="item.productPic">
                        <a @click="goodsDetails(item.productId)" :title="item.productName" target="_blank"></a>
                      </div>
                      <!--信息-->
                      <div class="name hide-row fl">
                        <div class="name-table">
                          <a @click="goodsDetails(item.productId)" :title="item.productName" target="_blank"
                             v-text="item.productName"></a>
                          <ul class="attribute">
                            <li>白色</li>
                          </ul>
                        </div>
                      </div>
                      <!--删除按钮-->
                      <div class="operation">
                        <a class="items-delete-btn" @click="cartdel(item.id)"></a>
                      </div>
                      <!--商品数量-->
                      <div>
                        <!--总价格-->

                        <div class="subtotal" style="font-size: 14px">¥ {{ item.price * item.quantity }}</div>
                        <div class="item-cols-num" style="height: 140px;
                                   display: flex;
                                   align-items: center;
                                   justify-content: center;">
                          <el-input-number v-model="item.quantity" @change="editCart(item.id ,item.quantity)">
                          </el-input-number>
                        </div>
                        <div class="price1">¥ {{ item.price }}</div>
                        <!--数量-->

                        <!--价格-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </div>
        <div class="cart-bottom-bg fix-bottom">
          <div class="fix-bottom-inner">
            <div class="cart-bar-operation">
              <div>
                <div class="choose-all">
                  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                  </el-checkbox>
                  <!--                  <span :class="{'checkbox-on':checkAllFlag}" class="blue-checkbox-new" @click="editCheckAll"></span>-->
                  <!--                  <span @click="editCheckAll">全选</span>-->
                </div>
                <div class="delete-choose-goods" @click="delChecked">删除选中的商品</div>
              </div>
            </div>
            <div class="shipping">
              <div class="shipping-box">
                <div class="shipping-total shipping-num"><h4
                    class="highlight">已选择 <i v-text="checkNum"></i> 件商品</h4>
                  <h5>共计 <i v-text="totalNum"></i> 件商品</h5></div>
                <div class="shipping-total shipping-price"><h4
                    class="highlight">应付总额：<span>￥</span><i v-text="totalPrice"></i>
                </h4>
                  <h5 class="shipping-tips ng-scope">应付总额不含运费</h5>
                </div>
              </div>
              <el-button :disabled="checkNum <= 0 || !submit" type="danger"
                        class="big-main-btn"  style="width: 130px ;font-size: 15px"
                         @click="checkout"
                       >结算</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="padding:50px">
        <div class="cart-e">
        </div>
        <p style="text-align: center;padding: 20px;color: #8d8d8d">你的购物车空空如也</p>
        <div style="text-align: center">
          <router-link to="/goods">
            <y-button text="现在选购" style="width: 150px;height: 40px;line-height: 38px;color: #8d8d8d"></y-button>
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

import {cartList, updateCart ,deleteCarts} from "@/api/cartitems";
import {setStore} from "@/utils/storage";
import {mapState, mapMutations} from "vuex";
import store from '@/store'

export default {
  data() {
    return {
      input: '',
      cartIds: [],
      checkAll: false,
      isIndeterminate: false,
      submit : true
    }
  },
  computed: {
    ...mapState(["login", "userInfo", "cartList", "showCart"]),
    totalNum() {
      return (
          this.cartList &&
          this.cartList.reduce((total, item) => {
            total += item.quantity;
            return total;
          }, 0)
      );
    },
    checkNum(){
      if(this.isIndeterminate){
        return (
            this.cartList &&
            this.cartList.reduce((total, item) => {
              if(item.checked){
                total += item.quantity;
              }
              return total;
            }, 0)
        );
      }
      else if(this.checkAll) return this.totalNum
      return 0;

    },

    totalPrice() {
      return (
          this.cartList &&
          this.cartList.reduce((total, item) => {
            if(item.checked) {
              total += item.quantity * item.price;
            }
            return total;
          }, 0)
      );
    }
  },
  methods: {
    ...mapMutations(["SHOWCART", "INIT_BUYCART", "EDIT_CART"]),
    handleCheckAllChange(val) {
      let all = this.cartList.map(x =>{
        x.checked = val; //标记全部选中和不选择，便于后续计算选中价格和数量
        return  x.id
      })
      this.cartIds = val ? all: [];
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cartList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cartList.length;
    },
    cartShowState(state) {
      this.SHOWCART({
        showCart: state
      });
    },
    handleIconClick(ev) {
      if (this.$route.path === '/search') {
        this.$router.push({
          path: '/refreshsearch',
          query: {
            key: this.input
          }
        })
      } else {
        this.$router.push({
          path: '/search',
          query: {
            key: this.input
          }
        })
      }
    },

    checkout(){
      this.$router.push({
        name: 'checkout',
        params: {
          cartIds: this.cartIds
        }
      })
    },
    editCart(id, productNum) {
      if (this.login) { // 登陆了
        let params = {id: id, quantity: productNum}
        updateCart(params).then(res => {
          if (res.code === 200) {
            this.EDIT_CART({id, productNum})
          }
        })
      } else {
        this.EDIT_CART({id, productNum})
      }
    },
    cartdel(id){
      let params = [id]
      deleteCarts(params).then(res=>{
        if(res.code === 200){
          this.editCart(id , 0)
        }
      })
    },

    delChecked(){
      deleteCarts(this.cartIds).then(res=>{
        if(res.code === 200){
          this.cartIds.forEach(id=>{
            this.editCart(id , 0)
          })
        }
      })
    },
    openProduct(productId) {
      this.$router.push({
        path: '/productsDetail',
        query: {
          productId: productId
        }
      });
    },
    getCartList() {
      cartList().then(res => {
        if (res.code === 200) {
          setStore('buyCart', res.data)
        }
        // 重新初始化一次本地数据
      }).then(this.INIT_BUYCART)
    },
    loginOut() {
      store.commit("CLEAR")
      window.location.href = "/";
    },
  },
  mounted() {
    if (this.login) {
      this.getCartList()
    } else {
      this.INIT_BUYCART()
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.store-content {
  clear: both;
  width: 1220px;
  min-height: 600px;
  padding: 0 0 25px;
  margin: 0 auto;

  .gray-box {
    position: relative;
    margin-bottom: 30px;
    overflow: hidden;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #dcdcdc;
    border-color: rgba(0, 0, 0, .14);
    box-shadow: 0 3px 8px -6px rgba(0, 0, 0, .1);

    .title {
      padding-left: 30px;
      position: relative;
      z-index: 10;
      height: 60px;
      padding: 0 10px 0 24px;
      border-bottom: 1px solid #d4d4d4;
      border-radius: 8px 8px 0 0;
      box-shadow: rgba(0, 0, 0, .06) 0 1px 7px;
      background: #f3f3f3;
      background: -webkit-linear-gradient(#fbfbfb, #ececec);
      background: linear-gradient(#fbfbfb, #ececec);
      line-height: 60px;
      font-size: 18px;
      color: #333;
    }
  }

  .ui-cart {
    padding-bottom: 91px;

    .cart-table-title {
      position: relative;
      z-index: 1;
      line-height: 38px;
      height: 38px;
      padding: 0 0 0 30px;
      font-size: 12px;
      background: #eee;
      border-bottom: 1px solid #dbdbdb;
      border-bottom-color: rgba(0, 0, 0, .08);

      .name {
        float: left;
        text-align: left;
      }

      span {
        width: 137px;
        float: right;
        text-align: center;
        color: #838383;
      }
    }

    .cart-group.divide {
      .cart-items {
        border-top: 1px dashed #eee;
      }
    }

    .cart-items {
      position: relative;
      height: 140px;
      margin-left: 74px;
      /*删除*/
      .operation {
        padding: 58px 0 0;
        font-size: 12px;
        line-height: 24px;

        .items-delete-btn {
          background-image: url(/static/images/delete-btn-icon_a35bf2437e@2x.jpg);

          &:hover {
            background-position: 0 -36px;
          }
        }

        .items-delete-btn {
          display: block;
          width: 24px;
          height: 24px;
          margin: 0 auto;
          color: #C2C2C2;
          background: url(/static/images/delete-btn-icon_a35bf2437e@2x.jpg);
          -webkit-background-size: 100% auto;
          background-size: 100% auto;
          -moz-transition: none;
          -webkit-transition: none;
          -o-transition: none;
          transition: none;
        }
      }

      .subtotal {
        font-weight: 700;
      }

      .price1 {
        font-size: 10px;
      }

      .item-cols-num,
      .operation,
      .price1,
      .subtotal {
        overflow: hidden;
        float: right;
        width: 137px;
        text-align: center;
        color: #666;
        line-height: 140px;
      }
    }

    .cart-group.divide .cart-top-items:first-child .cart-items {
      border-top: none;
    }

    .items-choose {
      position: absolute;
      left: -74px;
      top: 0;
      width: 74px;
      height: 20px;
      padding: 60px 0 0 31px;
      font-size: 12px;
      color: #999;
    }

    .items-thumb {
      position: relative;
      margin-top: 30px;
      overflow: hidden;
      width: 80px;
      height: 80px;
    }

    img {
      width: 80px;
      height: 80px;
    }

    .cart-items .items-thumb > a, .ui-cart .cart-items .items-thumb > i {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border: 1px solid #fff;
      border-radius: 3px;
      border: 0 solid rgba(255, 255, 255, .1);
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
    }

    .name {
      width: 380px;
      margin-left: 20px;
      color: #323232;
      display: table;

      a {
        color: #333;
        font-size: 16px;
      }
    }

    .name-table {
      display: table-cell;
      vertical-align: middle;
      height: 140px;
    }

    .attribute, .name p {
      color: #999;
      font-size: 12px;
      padding-top: 4px;
      line-height: 17px;
    }

  }

}

.page-cart {
  padding-top: 40px;

  .fix-bottom {
    height: 90px;
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 1;
    background-position: center;
    background: #fdfdfd;
    background: -webkit-linear-gradient(#fdfdfd, #f9f9f9);
    background: linear-gradient(#fdfdfd, #f9f9f9);
    border-top: 1px solid #e9e9e9;
    box-shadow: 0 -3px 8px rgba(0, 0, 0, .04);

    .cart-bottom-bg {
      height: 80px;
      /*background: url(../img/store/library/cart-wrapper-bg_4c8003c76e.jpg) repeat-x;*/
      border-top: 1px solid #D9D9D9;
      border-radius: 0 0 8px 8px;
    }
  }

  .cart-bar-operation {
    float: left;
    padding: 35px 26px;
    font-size: 12px;
  }

  .blue-checkbox-new {
    float: left;
    margin-right: 9px;
  }

  .choose-all, .delete-choose-goods, .selected-count {
    float: left;
    height: 20px;
    line-height: 20px;
    cursor: pointer;
    position: relative;
  }

  .blue-checkbox-new, .blue-checkbox-new.checkbox-disable, .blue-checkbox-new.checkbox-on {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;

    cursor: pointer;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    vertical-align: middle;
  }

  .blue-checkbox-new.checkbox-on, .choose-checkbox-on .blue-checkbox-new {
    background: url(/static/images/checkbox-new_631a56a4f6.png) no-repeat 0 0;
  }

  .delete-choose-goods {
    position: relative;
    margin-left: 21px;
    color: #bbb;
  }

  .shipping {
    float: right;
    padding: 20px 30px;
  }

  .shipping-box {
    display: inline-block;
    padding-top: 1px;
    margin-right: 10px;
  }

  .shipping-total {
    display: inline-block;
    border-left: 1px solid #e1e1e1;
    padding: 0 20px;

    .shipping-price {
      width: 155px;
      padding-right: 0;
    }

    &.shipping-num i {
      width: 28px;
      display: inline-block;
      text-align: center;
    }

    h4 {
      color: #323232;

      > i {
        font-size: 18px;
        font-weight: 700;
      }

      i, span {
        color: #d44d44;
      }

    }

    h5 {
      color: #959595;

      > i {
        font-size: 16px;
        font-weight: 700;
      }
    }

  }

  .shipping-total.shipping-num {
    text-align: right;
  }

  .shipping-total:first-child {
    border: none;
  }

  .big-main-btn {
    float: right;
    height: 48px;
  }
}

.cart-e {
  margin: 0 auto;
  background: url("/static/images/cart-empty_@2x.png") no-repeat;
  width: 275px;
  height: 300px;
  color: #8d8d8d;
}


</style>