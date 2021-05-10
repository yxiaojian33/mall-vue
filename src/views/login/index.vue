<template>
  <div class="login" v-loading="loading">
    <div class="box">
      <span>使用账号 登录官网</span>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input type="text" v-model="ruleForm.username" autocomplete="off" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked" style="float: left">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button style="margin-left: 80px;" @click="toRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setStore, getStore, removeStore } from "@/utils/storage";
import {setSupport,getSupport,setCookie,getCookie} from '@/utils/support';
import { getToken, setToken, removeToken } from '@/utils/auth'
import {login ,getInfo} from '@/api/member'
import store from '@/store'
export default {
  data() {
    let validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      loading : false ,
      checked: false,
      redirect: '',
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ validator: validateUser, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }]
      },
      cart: []
    };
  },
  mounted() {

    this.checked = JSON.parse(getStore('remember'))
    //缓存当前购物车中的数据
    this.ruleForm.username = this.checked?getCookie("username"):''
    this.ruleForm.password = this.checked?getCookie("password"):''
    this.redirect =this.$route.query.redirect;
    this.login_addCart();
  },
  methods: {
    toRegister(){
      this.$router.push('/register')
    },
    remember(){
      if(this.checked){
        setCookie("username",this.ruleForm.username,15);
        setCookie("password",this.ruleForm.password,15);
      }
      setStore('remember',this.checked)
    },
    login_addCart() {
      let cartArr = [];
      let localCart = JSON.parse(getStore("buyCart"));

      if (localCart && localCart.length) {
        localCart.forEach(item => {
          cartArr.push({
            userId: getStore("id"),
            productId: item.productId,
            productNum: item.productNum
          });
        });
      }
      this.cart = cartArr;
    },
     submitForm(formName) {
      this.loading = true
      this.$refs[formName].validate( valid => {
        if (valid) {
          login(this.ruleForm).then((res)=>{
            if(res.code == 200){
              const data = res.data
              const tokenStr = data.tokenHead+data.token
              getInfo().then(info=>{
                if(info.code ===200){
                  store.commit('ISLOGIN', info.data)
                }
              })
              setToken(tokenStr)
              this.remember()
              window.location.href = "/";
              // if(this.redirect && this.redirect.length){ this.$router.push({path: this.redirect})}
              // else this.$router.push('/')
            }
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      this.loading = false
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  overflow: visible;
  background: #ededed;
  .box {
    width: 450px;
    border: 1px solid #dadada;
    border-radius: 10px;
    position: absolute;
    top: 200px;
    left: 50%;
    padding: 50px 50px 50px 10px;
    margin-left: -225px;
    box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
      0 18px 20px -10px rgba(0, 0, 0, 0.04),
      0 18px 20px -10px rgba(0, 0, 0, 0.04),
      0 10px 20px -10px rgba(0, 0, 0, 0.04);
    text-align: center;
    form {
      margin-top: 30px;
    }
    span {
      color: #333;
      font-weight: 400;
    }
  }
}
</style>