
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
      <template>
        <div class="ADDUploadImage_Div">
          <canvas id="tp" v-if="icontof" style="width:200px;height:355px;"></canvas>
          <img v-else id="myicons" style="width:200px;height:355px;" :src="myicons">
          <div>
            <div style="width:230px;height:100px;margin-top:10px;">*仅支持JPG、PNG格式的图片文件 文件大小小于5M</div>
            <div style="width:230px;height:30px;position: relative;">
              <el-button size="small" style="width:80px">本地上传</el-button>
              <input id="myfile" type="file" name="files" multipart class="UIfile" title="点击选择本地文件" @change="getFile($event)" accept="image/jpeg,image/png" />
              <div style="display:none">{{qwe}}</div>
            </div>
          </div>
        </div>
      </template>
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
      <el-button type="primary" size="large" style="width:100px" @click="Onupdbanner">提 交</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {
  updAdvert
} from '@/api/api';
export default {
  data() {
    return {
      myicons: '',
      files: '',
      qwe: '',
      imageUrl: '',
      icontof: true,
      ie9tof: navigator.userAgent.indexOf("MSIE 9.0") > 0,
      form: {
        id: '',
        title: '',
        val: '',
        cover: '',
        model: '',
        postion: ''
      },
      advert: window.localStorage.getItem('saasadvert'),
      ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : ''
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  mounted() {
    let advert = JSON.parse(this.advert)
    if (advert) {
      this.form.id = advert.id;
      this.form.title = advert.title;
      this.form.val = advert.val;
      this.form.cover = advert.cover;
      this.form.model = advert.model.toString();
      this.form.postion = advert.postion.toString();
      this.icontof = false;
      this.myicons = advert.cover;
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
    Onupdbanner() {
      // console.log(this.files);
      if (this.files !== "") {
        var loginParams = {
          id: this.form.id,
          title: this.form.title,
          val: this.form.val,
          model: this.form.model,
          postion: this.form.postion
        };
        // console.log(loginParams);
        updAdvert(loginParams).then(data => {
          // console.log(data);
          if (data.success) {
            this.openSuccess('修改成功！')
            this.$router.push('/Advert');
          } else {
            this.openError(data.resMsg);
          }
        });
      } else {
        this.openError('请选择图片！');
      }
    },
    Back() {
      this.$router.push('/Advert');
    },
    getFile(objs) {
      this.files = '123';
      if (this.ie9tof) {
        this.icontof = true;
        var obj = document.getElementById("myfile");
        obj.select();
        obj.blur();
        this.files = document.selection.createRange().text;
        document.selection.empty();
        document.getElementById("tp").style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src='" + this.files + "')";
      } else {
        this.icontof = false;
        this.qwe++;
        setTimeout(function() {
          var myicons = document.getElementById("myicons");
          this.files = objs.target.files[0];
          // console.log(this.files);
          var reader = new FileReader();
          reader.readAsDataURL(this.files);
          reader.onload = function(e) {
            myicons.src = this.result;
          }
        }, 100);
      }
    }
  }
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
