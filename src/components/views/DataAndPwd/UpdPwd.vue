<template>
<div>
  <div class="TopName W95">修改密码</div>
  <div class="TopLine"></div>
  <div class="" style="margin:50px auto;">
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="原密码" v-if="form.loginType==='0'">
        <el-input v-model="form.oldPassword" style="width: 400px;" type="password" @change="verification"></el-input>
      </el-form-item>
      <el-form-item label="验证码" v-if="form.loginType==='1'">
        <el-input v-model="form.code" style="width: 296px;" @change="verification"></el-input>
        <el-button @click="getcode" :disabled="msgtof" style="width:100px;">{{count}}</el-button>
      </el-form-item>
      <el-form-item label="新的登录密码">
        <el-input v-model="form.pwd" style="width: 400px;" type="password" @change="verification"></el-input>
      </el-form-item>
      <el-form-item label="确认新的密码">
        <el-input v-model="form.pwd2" style="width: 400px;" type="password" @change="verification"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" style="width:120px" :disabled="tof">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import {
  requestCode,
  updUserPass
} from '../../../api/api';
export default {
  data() {
    return {
      form: {
        oldPassword: '',
        code: '',
        userName: window.localStorage.saasuser ? JSON.parse(window.localStorage.saasuser).name : '',
        pwd: '',
        pwd2: '',
        loginType: window.localStorage.loginType !== undefined ? window.localStorage.loginType : ''
      },
      count: '发送验证码',
      msgtof: false,
      tof: true
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
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
    onSubmit() {
      // console.log(this.form);
      updUserPass(this.form).then(data => {
        // console.log(data);
        if (data.success) {
          this.openSuccess("修改成功");
        } else {
          this.openError(data.resMsg);
        }
      });
    },
    getcode() {
      var loginParams = {
        mobile: window.localStorage.getItem("saasmobile")
      };
      // console.log(window.localStorage.getItem("saasmobile"));
      requestCode(loginParams).then(data => {
        // console.log(data);
        if (data.success) {
          this.openSuccess("已获取验证码");
          this.msgtof = true;
          let that = this;
          timeout();

          function timeout() {
            if (that.count === '发送验证码') {
              that.count = 60;
              timeout();
            } else if (that.count === 1) {
              that.count = '发送验证码'
              that.msgtof = false;
            } else {
              setTimeout(function() {
                that.count--;
                timeout();
              }, 1000);
            }
          }
        } else {
          this.openError(data.resMsg);
        }
        this.ResourceData = data.resList;
      });
    },
    verification() {
      if (this.form.loginType === '0') {
        if (this.form.oldPassword.length > 5 && this.form.oldPassword.length < 17 && this.form.pwd.length > 5 && this.form.pwd.length < 17 && this.form.pwd === this.form.pwd2) {
          this.tof = false;
        }
      } else if (this.form.loginType === '1') {
        if (this.form.code.length === 4 && this.form.pwd.length > 5 && this.form.pwd.length < 17 && this.form.pwd === this.form.pwd2) {
          this.tof = false;
        }
      } else {
        this.tof = true;
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
