<template>
  <div class="register">
    <div class="box">
      <span>手机注册账号</span>
      <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
      >
        <el-form-item label="手机" prop="telphone">
          <el-input type="text" v-model="ruleForm.telphone" autocomplete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
          <el-row>
            <el-col :span="16">
              <el-form-item label="验证码" prop="verification" >
               <el-input  type="text" v-model="ruleForm.verification" autocomplete="off" placeholder="请输入验证码" width="80px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button :disabled="!ruleForm.telphone  || disabled" @click="sendCode('ruleForm')">{{ buttonMsg }}</el-button>
            </el-col>
          </el-row>
        <el-form-item label="账号" prop="username">
          <el-input type="text" v-model="ruleForm.username" autocomplete="off" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm">
          <el-input type="password" v-model="ruleForm.confirm" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked" style="float: left">同意注册协议</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button  :disabled="!checked" type="primary" @click="toRegister('ruleForm')">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const TIME_COUNT = 60;
const TEL_MATCH =/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
const NAME_MATCH =/^[a-zA-Z0-9_-]{4,16}$/;;
import { setStore, getStore, removeStore } from "@/utils/storage";
import {setSupport,getSupport,setCookie,getCookie} from '@/utils/support';
import { getToken, setToken, removeToken } from '@/utils/auth'
import {login ,getInfo ,getAuthCode , register} from '@/api/member'
import store from '@/store'
export default {
  data() {
    let validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      }
      else if(NAME_MATCH.test(value)){
        callback()
      }
      else {
        callback(new Error("账号名仅支持字母，数字，下划线，减号"));
      }
    };

    let validateTel = (rule, value, callback) => {
      if(TEL_MATCH.test(value)){
        callback();
      } else {
        callback(new Error("请输入11位手机号码"));
      }
    };
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
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
    let validateConfirmPass = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请确认密码"));
      }
      else if (value != this.ruleForm.password) {
        callback(new Error("请确认两次密码相同"));
      }
      else {
        callback();
      }
    };
    return {
      disabled:false,
      buttonMsg :"发送验证码",
      checked: false,
      timer : null,
      count : 0,
      redirect: '',
      ruleForm: {
        username: "",
        password: "",
        confirm: "",
        telphone:'',
        verification:''
      },
      rules: {
        telphone: [{ validator: validateTel, trigger: "blur" }],
        verification: [{ validator: validateCode, trigger: "blur" }],
        username: [{ validator: validateUser, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        confirm: [{ validator: validateConfirmPass, trigger: "blur" }]
      },
      cart: []
    };
  },
  mounted() {
    //缓存当前购物车中的数据
    this.ruleForm.username = this.checked?getCookie("username"):''
    this.ruleForm.password = this.checked?getCookie("password"):''
    this.redirect =this.$route.query.redirect;
    this.login_addCart();
  },
  methods: {

    sendCode(formName) {
      this.$refs[formName].validateField('telphone' ,async valid => {
        if (!valid && !this.timer) {
          let params = {telephone : this.ruleForm.telphone}
          getAuthCode(params).then(res=>{
            if(res.code === 200){
              this.count = TIME_COUNT;
              this.disabled = true;
              this.timer = setInterval(() => {
                this.buttonMsg = this.count > 0 ? ( this.count + 's 重新发送') : '发送验证码'
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                } else {
                  this.disabled = false;
                  clearInterval(this.timer); // 清除定时器
                  this.timer = null;
                }
              }, 1000)
            }
          })
        }
      })
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
    async toRegister(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let params ={
            authCode:this.ruleForm.verification,
            password:this.ruleForm.password,
            telephone:this.ruleForm.telphone,
            username:this.ruleForm.username,
          }
         register(params).then(res=>{
              if(res.code === 200){
                setCookie("username",this.ruleForm.username,15);
                setCookie("password",this.ruleForm.password,15);
                alert("成功")
              }
         })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.register {
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