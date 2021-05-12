import Vue from 'vue'
import Vuex from 'vuex'

import { setStore, getStore ,removeStore} from '@/utils/storage'
import {removeToken} from "@/utils/auth";

export default new Vuex.Store({
  state: {
    login: JSON.parse( getStore('login')) || false,//是否登录
    userInfo: JSON.parse( getStore('userInfo')),//用户信息
    cartList: JSON.parse( getStore('cartList'))||[],//加入购物车商品
    showCart: false,
    remember: JSON.parse( getStore('remember'))
  },
  mutations: {
    CLEAR (state) {
      removeToken();
      removeStore("token");
      removeStore("buyCart");
      removeStore("login");
      removeStore("userInfo");
    },
    // 网页初始化时从本地缓存获取购物车数据
    INIT_BUYCART (state) {
      let initCart = getStore('buyCart')
      console.log(initCart)
      if (initCart) {
        state.cartList = JSON.parse(initCart)
      }
      console.log(state)
    },
    SHOWCART(state, { showCart }) {
      state.showCart = showCart;
    },
    ISLOGIN(state, info) {
      state.userInfo = info;
      state.login = true;
      setStore('userInfo', info);
      setStore('login', true);
    },
    EDIT_CART(state, { id , productId, productName, productNum = 1 }){
      let cart = state.cartList;
      if (productNum) {
        cart.forEach((item, i) => {
          if (item.id === id) {
            item.quantity = productNum
          }
        })
      } else if (id) {
        cart.forEach((item, i) => {
          if (item.id === id) {
            cart.splice(i, 1)
          }
        })
      }
      state.cartList = cart
      // 存入localStorage
      setStore('buyCart', state.cartList)
    },
    ADDCART(state, {id ,productId, price, productName, productPic, quantity = 1 }) {
      let cart = state.cartList;
      let goods = {
        id,
        productId,
        price,
        productName,
        productPic
      }
      console.log(price)
      let falg = true;
      if (cart.length) {
        cart.forEach(item => {
          if (item.id === id) {
            if (item.quantity >= 0) {
              falg = false;
              item.quantity += quantity;
            }
          }
        })
      }
      if (!cart.length || falg) {
        goods.quantity = quantity;
        cart.push(goods);
      }
      state.cartList = cart;
      setStore('buyCart', cart);
    }

  },
  actions: {
  },
  modules: {
  }
})
