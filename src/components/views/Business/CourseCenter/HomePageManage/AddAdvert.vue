<template>
<div style="width:100%;height:100%;">
  <div style="background: #F5F5F5">
    <div class="TopName W95"><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="Back"></i>返回</div>
  </div>
  <div class="TopLine"></div>
  <br />
  <br />
  <el-form ref="form" :model="form" label-width="100px" id="form" method="post">
    <el-form-item label="广告名称">
      <el-input v-model="form.title" style="width: 385px;" id="livename" autofocus></el-input>
    </el-form-item>
    <el-form-item label="广告链接">
      <el-input v-model="form.val" style="width: 385px;" id="livename" autofocus></el-input>
    </el-form-item>
    <el-form-item label="广告封面">
      <uppicture aspectRatio="16/9" @upload="upload"></uppicture>
    </el-form-item>
    <el-form-item label="广告类型" style="margin-bottom: 0">
      <el-radio v-model="form.model" label="1">专题</el-radio>
      <el-radio v-model="form.model" label="2">{{ThemeName}}</el-radio>
      <el-radio v-model="form.model" label="3">URL</el-radio>
      <el-radio v-model="form.model" label="6">预约</el-radio>
      <el-radio v-model="form.model" label="4">其他</el-radio>
    </el-form-item>
    <el-form-item label="广告位置" style="margin-bottom: 0">
      <el-radio v-model="form.postion" label="6">预约列表</el-radio>
      <el-radio v-model="form.postion" label="9">启动页</el-radio>
    </el-form-item>
    <br />
    <el-form-item label="">
      <el-button type="primary" size="large" style="width:100px" @click="Onaddadvert">提 交</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {
  addadvert,
  uploadImg
} from '@/../api/api';
import uppicture from '@/components/public/picture'
export default {
  components: {
    uppicture
  },
  data() {
    return {
      myicons: '',
      page: '',
      searchTxt: '',
      files: '',
      qwe: '',
      imageUrl: '',
      icontof: true,
      ie9tof: navigator.userAgent.indexOf("MSIE 9.0") > 0,
      form: {
        title: '',
        val: '',
        cover: '',
        model: '1',
        postion: '6'
      },
      ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : ''
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
    Onaddadvert() {
      // console.log(this.files);
      if (this.files !== "") {
        var loginParams = {
          title: this.form.title,
          val: this.form.val,
          cover: this.form.cover,
          postion: this.form.postion
        };
        addadvert(loginParams).then(data => {
          // console.log(data);
          if (data.success) {
            this.openSuccess('添加成功！')
            this.$router.push('/Advert');
          } else {
            this.openError(data.resMsg);
          }
        });
      } else {
        this.openError('请选择图片');
      }
    },
    Back: function() {
      this.$router.push('/Advert');
    }
  }
}
</script>
