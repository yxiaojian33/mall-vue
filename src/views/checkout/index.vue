<template>
  <div class="w" style="padding-top: 40px;" v-loading="loading">
    <y-shelf title="收货信息">
      <template v-slot:content>
        <el-collapse accordion>
          <el-collapse-item>
            <template #title>
              <div style="font-size: 15px;margin: 20px">
                <span> {{ getAddressString }}</span>
              </div>
            </template>
            <el-radio-group v-model="checkedAddress">
              <ul class="address-item-list clearfix">
                <el-popover
                    placement="right"
                    :width="400"
                    trigger="click"
                >
                  <template #reference>
                    <li class="add-address-item">
                      <img src="/static/svg/jia.svg" alt="">
                      <p>使用新地址</p>
                    </li>
                  </template>

                  <el-form
                      :model="address"
                      status-icon
                      :rules="rules"
                      ref="address"
                      label-width="100px"
                      class="address"
                  >
                    <el-form-item label="收货人名称" prop="name">
                      <el-input type="text" v-model="address.name" autocomplete="off" placeholder="请输入收件人名称"></el-input>
                    </el-form-item>

                    <el-form-item label="联系方式" prop="phoneNumber">
                      <el-input type="text" v-model="address.phoneNumber" autocomplete="off"
                                placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="邮政编码" prop="postCode">
                      <el-input type="text" v-model="address.postCode" autocomplete="off"
                                placeholder="请输入邮政编码"></el-input>
                    </el-form-item>
                    <div style="text-align: center">
                      <el-row :gutter="30">
                        <el-col :span="7" :offset="2">
                          <el-form-item label-width="10" label="省份" prop="province">
                            <el-input type="text" v-model="address.province" autocomplete="off"
                                      placeholder="省份/直辖市"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="7">
                          <el-form-item label-width="10" label="城市" prop="city">
                            <el-input type="text" v-model="address.city" autocomplete="off" placeholder="城市"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="7">
                          <el-form-item label-width="10" label="区" prop="region">
                            <el-input type="text" v-model="address.region" autocomplete="off"
                                      placeholder="区"></el-input>
                          </el-form-item>
                        </el-col>


                      </el-row>
                    </div>


                    <el-form-item label="详细地址" prop="detailAddress">
                      <el-input type="text" v-model="address.detailAddress" autocomplete="off"
                                placeholder="请输详细地址(街道)"></el-input>
                    </el-form-item>

                    <el-form-item>
                      <el-checkbox v-model="address.defaultStatus" style="margin: 10px">默认地址</el-checkbox>
                      <el-button type="primary" @click="toAddAddress('address')">添加</el-button>
                    </el-form-item>
                  </el-form>
                </el-popover>
                <li v-for="(item,i) in memberReceiveAddressList"
                    :key="i">
                  <div class="address-info">
                    <el-radio :label="item">
                      <div>
                        <p><b>收货人:</b> {{ item.name }} {{ item.defaultStatus ? '(默认地址)' : '' }}</p>
                        <p class="street-name ellipsis"><b>收货地址:</b> {{
                            item.province + item.city + item.region + item.detailAddress
                          }}</p>
                        <p><b>手机号码:</b> {{ item.phoneNumber }}</p>
                      </div>
                    </el-radio>
                  </div>
                  <div class="operation-section">
                    <span class="update-btn" style="font-size:12px" @click="update(item)">修改</span>
                    <span class="delete-btn" style="font-size:12px" :data-id="item.id"
                          @click="del(item.id)">删除</span>
                  </div>
                </li>
              </ul>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </template>
    </y-shelf>
    <!-- 购物清单 -->
    <y-shelf title="购物清单">
      <template v-slot:content>
        <div class="box-inner ui-cart">
          <div>
            <!--标题-->
            <div class="cart-table-title">
              <span class="name">商品信息</span>
              <span class="subtotal">小计</span>
              <span class="num">数量</span>
              <span class="price">单价</span>
            </div>
            <!--列表-->
            <div class="cart-table" v-for="(item,i) in confirmInfo.cartPromotionItemList" :key="i">
              <div class="cart-group divide pr" :data-productid="item.productId">
                <div class="cart-top-items">
                  <div class="cart-items clearfix">
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
                          <li>{{ item.productAttr }}</li>
                        </ul>
                      </div>
                    </div>
                    <!--商品数量-->
                    <div>
                      <!--总价格-->
                      <div class="subtotal" style="font-size: 14px">¥ {{ item.price * item.quantity }}</div>
                      <!--数量-->
                      <div class="item-cols-num">
                        <span v-text="item.quantity"></span>
                      </div>
                      <!--价格-->
                      <div class="price">¥ {{ item.price }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 合计 -->
          <div class="cart-bottom-bg fix-bottom">
            <div class="fix-bottom-inner">
              <div class="shipping">
                <div>
                  <ul>
                    <li> 总金额 <span class="amounn">{{ Number(confirmInfo.calcAmount.totalAmount).toFixed(2) }}</span>
                    </li>
                    <li> 运费 <span class="amounn"> {{ Number(confirmInfo.calcAmount.freightAmount).toFixed(2) }} </span>
                    </li>
                    <li> 活动优惠<span
                        class="amounn"> {{ Number(confirmInfo.calcAmount.promotionAmount).toFixed(2) }} </span></li>
                  </ul>
                </div>
                <div class="shipping-box" style="padding: 0 40px;">
                  <div class="shipping-total shipping-price"><h4
                      class="highlight">应付总额：<em>￥{{ Number(confirmInfo.calcAmount.payAmount).toFixed(2) }}</em>
                  </h4>
                  </div>
                </div>
                <el-button type="danger">去支付</el-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </y-shelf>
  </div>
</template>

<script>
import YShelf from '@/components/Shelf'
import {generateConfirmOrder} from '@/api/order'
import {addAddress, getAddress} from '@/api/member'

const TEL_MATCH = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
export default {
  name: "index",
  components: {
    YShelf,
  },
  computed: {
    getAddressString() {
      let address = this.checkedAddress;
      if (!address) return "请选择收货地址"
      return address.name + "    " + address.phoneNumber + "    " + address.province + address.city + address.region + address.detailAddress
    }
  },
  data() {
    let validateTel = (rule, value, callback) => {
      if (TEL_MATCH.test(value)) {
        callback();
      } else {
        callback(new Error("请输入11位手机号码"));
      }
    };
    let validateNotNull = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写" + rule.field));
      } else callback()
    };
    return {
      loading: true,
      checkedAddress: null,
      cartIds: [],
      memberReceiveAddressList: [],
      confirmInfo: {
        calcAmount: {},
        cartPromotionItemList: [],
        couponHistoryDetailList: [],
        integrationConsumeSetting: {},
        memberReceiveAddressList: []
      },
      address: {
        name: '',
        phoneNumber: '',
        postCode: '',
        province: '',
        region: '',
        city: '',
        detailAddress: '',
        defaultStatus: ''
      },
      rules: {
        name: [{validator: validateNotNull, trigger: "blur"}],
        phoneNumber: [{validator: validateTel, trigger: "blur"}],
        postCode: [{validator: validateNotNull, trigger: "blur"}],
        province: [{validator: validateNotNull, trigger: "blur"}],
        region: [{validator: validateNotNull, trigger: "blur"}],
        city: [{validator: validateNotNull, trigger: "blur"}],
        detailAddress: [{validator: validateNotNull, trigger: "blur"}],
      },
    }
  },
  methods: {
    toAddAddress(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let params = this.address;
          params.defaultStatus = addAddress.defaultStatus ? 1 : 0
          addAddress(params).then(res => {
            if (res.code === 200) {
              this.$notify.success({
                title: '成功',
                message: '添加收获地址成功',
                showClose: false
              });
              getAddress().then(x => {
                if (x.code === 200) {
                  this.memberReceiveAddressList = x.data;
                }
              })
            }
          })
        }
      })
    }
  },
  mounted() {
    this.loading = true
    this.cartIds = this.$route.params.cartIds
    if (this.cartIds && this.cartIds.length > 0) {
      generateConfirmOrder(this.cartIds).then(res => {
        if (res.code === 200) {
          this.confirmInfo = res.data
          this.memberReceiveAddressList = this.confirmInfo.memberReceiveAddressList
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// 收货地址
.address-item-list {
  padding: 30px 13px 0;

  .address {
    padding: 19px 14px 0 19px;

    p {
      line-height: 26px;
    }
  }

  li.checked {
    border-color: #6A8FE5;
    position: relative;
    background: #fff;

    .pa {
      right: 15px;
      top: 18px;
    }

    &:hover {
      background: #fff;
    }
  }

  li {
    position: relative;
    overflow: hidden;
    float: left;
    width: 276px;
    height: 100px;
    margin: 0 0 30px 16px;
    border: 1px solid #E5E5E5;
    border-radius: 3px;
    background: #FAFAFA;
    line-height: 14px;
    text-align: left;
    word-wrap: break-word;
    word-break: normal;
    color: #626262;
    cursor: pointer;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -o-user-select: none;
    user-select: none;

    &:hover {
      background: #F2F2F2;

      .operation-section {
        visibility: visible;
        transform: translate(0, 0);
      }
    }

    &.add-address-item {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      p {
        margin-top: 5px;
      }
    }

    .operation-section {
      visibility: hidden;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 28px;
      background: #E1E1E1;
      border-top: 1px solid #E1E1E1;
      transition: all .2s ease;
      transform: translate(0, 29px);
      border-top: 1px solid #E1E1E1;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 11;

      span {
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 100%;

        &:hover {
          background: #F2F2F2;
        }
      }

      span + span {
        border-left: 1px solid #E1E1E1;
      }

    }
  }
}

.address-info {
  margin: 15px;

  p {

    overflow: hidden;
    text-overflow: ellipsis
  }
}

.amounn {
  margin-left: 10px;
  font-size: 15px;
  color: #e25147;
}

.s-content {
  .md {
    > div {
      text-align: left;
      margin-bottom: 15px;

      > input {
        width: 100%;
        height: 50px;
        font-size: 18px;
        padding: 10px 20px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-shadow: 0 3px 5px -4px rgba(0, 0, 0, .4) inset, -1px 0 3px -2px rgba(0, 0, 0, .1) inset;
        line-height: 46px;
      }
    }
  }

  .btn {
    margin: 0;
    width: 100%;
    height: 50px;
    font-size: 14px;
    line-height: 48px
  }
}

.ui-cart {
  img {
    width: 80px;
    height: 80px;
  }

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

    .subtotal {
      font-weight: 700;
    }

    .item-cols-num,
    .price,
    .subtotal {
      overflow: hidden;
      float: right;
      width: 137px;
      text-align: center;
      color: #666;
      line-height: 140px;
    }

    /*数量*/
    .subtotal,
    .item-cols-num {
      padding-top: 50px;
      line-height: 40px;
    }

    .select {
      width: 112px;
      height: 40px;
      padding-top: 4px;
      margin: 0 auto;
      line-height: 40px;

      .down {
        background-position: 0 -60px;
      }

      .down.down-disabled:hover {
        background-position: 0 -300px;
        cursor: not-allowed;
      }

      .num {
        position: relative;
        overflow: hidden;
        display: inline-block;
        width: 36px;
        height: 18px;
        margin: 7px 0 0;
        border: none;
        border-radius: 3px;
        line-height: 18px;
        text-align: center;
        font-size: 14px;
        transition: all .2s ease-out;
      }
    }

  }

  .down.down-disabled {
    background-position: 0 -300px;
    cursor: not-allowed;
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

.fix-bottom {
  padding: 22px 29px 19px 30px;
  height: 90px;
  width: 100%;
  z-index: 1;
  background-position: center;
  background: #fdfdfd;
  background: -webkit-linear-gradient(#fdfdfd, #f9f9f9);
  background: linear-gradient(#fdfdfd, #f9f9f9);
  border-top: 1px solid #e9e9e9;
  box-shadow: 0 -3px 8px rgba(0, 0, 0, .04);

  .cart-bottom-bg {
    height: 80px;
    border-top: 1px solid #D9D9D9;
    border-radius: 0 0 8px 8px;
  }

  .fix-bottom-inner {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .shipping {
    display: flex;
    align-items: center;
  }

  em {
    display: inline-block;
    position: relative;
    top: 3px;
    margin-top: -4px;
    font-size: 24px;
    color: #d44d44;
    font-weight: 700;
  }
}

.attribute, .name p {
  color: #999;
  font-size: 12px;
  padding-top: 4px;
  line-height: 17px;
}


</style>