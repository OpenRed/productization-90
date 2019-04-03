<template>
<div style="width:100%;height:100%;">
  <div class="TopName W95">参数设置</div>
  <div class="TopLine"></div>
  <br />
  <el-form ref="form" :model="form" label-width="100px" id="form" method="post">
    <el-form-item label="推流地址">
      <el-input v-model="form.livepath" style="width: 400px;" @change="verification"></el-input>
      <el-button style="width:120px;font-size:14px;height:36px;margin-left: 5px;" @click="ResetLivepath">恢复默认地址</el-button>
    </el-form-item>
    <el-form-item label="拉流地址">
      <el-input v-model="form.livePull" style="width: 400px;" @change="verification"></el-input>
      <el-button style="width:120px;font-size:14px;height:36px;margin-left: 5px;" @click="ResetPullpath">恢复默认地址</el-button>
    </el-form-item>
    <el-form-item label="播放地址">
      <el-input v-model="form.httpHost" style="width: 400px;" @change="verification"></el-input>
      <el-button style="width:120px;font-size:14px;height:36px;margin-left: 5px;" @click="ResetHttpHost">恢复默认地址</el-button>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" style="width:120px" @click="OnupdParam" :disabled="btnUpd">提交</el-button>
    </el-form-item>
    <el-form-item label="拉流地址列表">
      <el-table :data="defaultLivePullList" style="width: 528px">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="value" label="拉流地址">
        </el-table-column>
        <el-table-column prop="success" label="状态" width="100">
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {
  updorganization,
  getorganization
} from '@/api/api';
export default {
  data() {
    return {
      form: {
        livepath: '',
        livePull: '',
        httpHost: ''
      },
      btnUpd: true,
      defaultLivepath: '',
      defaultHttpHost: '',
      defaultLivePullList: []
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    } else {
      getorganization().then(data => {
        // console.log(data);
        if (data.livepath) this.form.livepath = data.livepath;
        if (data.livePull) this.form.livePull = data.livePull;
        if (data.httpHost) this.form.httpHost = data.httpHost;

        if (data.resMap && data.resMap.httpHost) this.defaultHttpHost = data.resMap.httpHost;
        if (data.resMap && data.resMap.livePath) this.defaultLivepath = data.resMap.livePath;
        if (data.resMap && data.resMap.livePullList) this.defaultLivePullList = data.resMap.livePullList;
      });
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
    verification() {
      if (this.form.livepath !== '' && this.form.livePull !== '' && this.form.httpHost !== '') {
        this.btnUpd = false;
      } else {
        this.btnUpd = true;
      }
    },
    OnupdParam() {
      updorganization({
        livepath: this.form.livepath,
        livePull: this.form.livePull,
        httpHost: this.form.httpHost
      }).then(data => {
        if (data.success) {
          this.openSuccess('提交成功！');
        } else {
          this.openError(data.resMsg);
        }
      });
    },
    ResetLivepath() {
      this.form.livepath = this.defaultLivepath;
    },
    ResetPullpath() {
      this.form.livePull = this.defaultLivePullList[0].value;
    },
    ResetHttpHost() {
      this.form.httpHost = this.defaultHttpHost;
    }
  }
}
</script>
