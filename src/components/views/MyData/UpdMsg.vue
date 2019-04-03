<template>
<div>
  <el-form ref="form" :model="form" label-width="100px" style="position: relative;">
    <el-form-item label="昵称">
      <el-input v-model="form.nickName" style="width: 255px;" :maxlength="10" @change="verification"></el-input>
    </el-form-item>
    <el-form-item label="姓名">
      <el-input v-model="form.name" style="width: 255px;" :maxlength="10" @change="verification"></el-input>
    </el-form-item>
    <el-form-item label="生日">
      <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期" @change="verification" :clearable='false' style="width: 255px">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="form.gender" @change="verification">
        <el-radio :label="1">男</el-radio>
        <el-radio :label="0">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click.native.prevent="onSubmit" :disabled="btnSubmit" style="width:120px">提交</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {
  updUserInfo
} from '../../../api/api';
import {
  formatDate
} from '../../../util/util';
import uppicture from '@/components/public/picture'

export default {
  components: {
    uppicture
  },
  data() {
    return {
      btnSubmit: true,
      form: {
        name: window.localStorage.saasuser ? JSON.parse(window.localStorage.saasuser).name : '',
        nickName: window.localStorage.saasuser ? JSON.parse(window.localStorage.saasuser).nickName : '',
        birthday: window.localStorage.saasuser ? JSON.parse(window.localStorage.saasuser).birthday : '',
        gender: window.localStorage.saasuser ? JSON.parse(window.localStorage.saasuser).gender : '',
      }
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
    verification(){
      this.btnSubmit = false;
    },
    onSubmit() {
      var params = {}
      let saasuser = JSON.parse(window.localStorage.saasuser);
      let birthday = new Date(this.form.birthday).getTime();

      if (saasuser.name !== this.form.name) {
        params['name'] = this.form.name;
        saasuser.name = this.form.name;
      }
      if (saasuser.nickName !== this.form.nickName) {
        params['nickName'] = this.form.nickName;
        saasuser.nickName = this.form.nickName;
      }
      if (saasuser.birthday !== birthday) {
        params['birthday'] = birthday;
        saasuser.birthday = birthday;
      }
      if (saasuser.gender !== this.form.gender) {
        params['gender'] = this.form.gender;
        saasuser.gender = this.form.gender;
      }
      console.log(JSON.stringify(this.form));
      console.log(JSON.stringify(params));
      updUserInfo(params).then(data => {
        // console.log(data);
        if (data.success && data.resCode === 0) {
          window.localStorage.saasuser = JSON.stringify(saasuser);
          this.openSuccess("修改成功");
          // window.location.reload();
        } else {
          this.openError(data.resMsg);
        }
      });
    },
    covermove() {
      var cover = document.getElementById('cover');
      cover.style.opacity = 0.2;
      var coverB = document.getElementById('coverB');
      coverB.style.visibility = 'visible';
      var coverT = document.getElementById('coverT');
      coverT.style.visibility = 'visible';
    },
    coverout() {
      var cover = document.getElementById('cover');
      cover.style.opacity = 0;
      var coverB = document.getElementById('coverB');
      coverB.style.visibility = 'hidden';
      var coverT = document.getElementById('coverT');
      coverT.style.visibility = 'hidden';
    },
    GoUpdIcon() {
      this.$router.push('/UpdIcon');
    }
  },
}
</script>
<style>
.q {
  position: absolute;
}

.cover {
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 10;
  background: #dcdcdc;
  opacity: 0;
}

.coverB {
  position: absolute;
  left: 0px;
  top: 170px;
  z-index: 10;
  visibility: hidden;
  width: 200px;
  height: 30px;
  background: black;
  cursor: pointer;
  opacity: 0.4;
}

.coverT {
  position: absolute;
  left: 0px;
  top: 170px;
  z-index: 15;
  visibility: hidden;
  width: 200px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  color: #cdcdcd;
  font-size: 12px
}
</style>
