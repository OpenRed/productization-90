<template>
<div class="login-wrap" id="aaa">
  <div class="ms-title">{{title}}</div>
  <div class="ms-login">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
      <el-form-item prop="username">
        <el-input v-model="ruleForm.username" placeholder="账号/手机号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
      </el-form-item>
      <div class="login-btn">
        <el-button type="primary" @click.native.prevent="submitForm">登录</el-button>
      </div>
      <p style="font-size:12px;line-height:30px;color:red;text-align: center;">{{message}}</p>
    </el-form>
  </div>
</div>
</template>

<script>
import {
  requestLogin,
  requestCode,
  saasInit
} from '../api/api';
import {
  SaveMsg,
  ClearMsg
} from '../util/util';
export default {
  data: function() {
    return {
      message: '',
      title: '',
      count: '发送验证码',
      btnCount: false,
      // time: 60,
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: {
          required: true,
          message: '请输入账号/手机号',
          trigger: 'blur'
        },
        password: {
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }
      }
    }
  },
  beforeCreate: function() {
    window.localStorage.saasLoginTrueOrFalse = 'false';

    saasInit().then(data => {
      this.title = data.initName
      if (data.orgFlag === "0") {
        if (data.loginUrl) window.location.href = data.loginUrl;
      }
      if (data.categoryId) window.localStorage.saascateid = data.categoryId;
    })
  },
  mounted() {
    // document.onkeydown = (e) => {
    //   var key = window.event.keyCode;
    //   if (key == 13) {
    //     this.submitForm('ruleForm');
    //   }
    // }
  },
  methods: {
    openSuccess(text) {
      this.$message({
        message: text,
        type: 'success'
      });
    },
    openError(text) {
      this.$message({
        showClose: true,
        message: text,
        type: 'error'
      });
    },
    submitForm(ev) {
      if (!this.ruleForm.username) return this.openError('账号/手机号不能为空！')
      if (!this.ruleForm.password) return this.openError('密码不能为空！')
      const self = this;
      self.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.logining = true;
          var loginParams = {
            userName: this.ruleForm.username,
            code: this.ruleForm.password
          };
          requestLogin(loginParams).then(data => {
            // console.log(data);
            if (data.success) {
              if (data.nickName === undefined) {
                data.nickName = '';
              }
              //成功之后把信息都存入本地缓存
              SaveMsg(data);
              window.localStorage.saasLoginTrueOrFalse = 'true';
              if (data.loginType!==undefined) window.localStorage.loginType = data.loginType;
              if (data.fileServer!==undefined) window.localStorage.saasUploadFileUrl = process.env.NODE_ENV === 'development' ? 'http://192.168.21.196:3000/file' : data.fileServer + '/file';

              self.$router.push('/Plate');
              this.message = "";
            } else {
              this.message = data.resMsg;
              //失败之后把本地缓存清除掉
              ClearMsg();
            }
          }).catch(err => {
            this.message = '请求失败，请稍后重试！'
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getCode() {
      if (/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|)+\d{8})$/.test(this.ruleForm.username) == true && this.ruleForm.username.length === 11) {
        var loginParams = {
          mobile: this.ruleForm.username
        };
        requestCode(loginParams).then(data => {
          if (data.success) {
            this.message = "已获取短信验证码";
            this.btnCount = true;
            let that = this;
            timeout();

            function timeout() {
              if (that.count === '发送验证码') {
                that.count = 60;
                timeout();
              } else if (that.count === 1) {
                that.count = '发送验证码'
                that.btnCount = false;
              } else {
                setTimeout(function() {
                  that.count--;
                  timeout();
                }, 1000);
              }
            }
          } else {
            this.message = data.resMsg;
          }
        });
      }
    }
  }
}
</script>
