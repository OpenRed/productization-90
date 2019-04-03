<template>
<div style="padding: 20px 0;">
  <el-form ref="form" :model="form" label-width="100px" style="position: relative;">
    <el-form-item label="用户头像">
      <div class="show" style="width:200px;height:200px;float: left;border:1px solid #dfe6ec;">
        <img class="picture" :src="form.logoUrl" :onerror="errorImg" width="100%" height="100%" />
      </div>
      <div class="choose upload" style="float:left;margin-left:10px;">
        <label title="选择图片" class="choose-btn">
          <input type="file" accept="image/jpg,image/jpeg,image/png" name="file" style="display:none" @change="choosefile">
          <span class="choose-file">选择图片</span>
        </label>
      </div>
    </el-form-item>
      <br />
    <el-form-item>
      <el-button type="primary" @click.native.prevent="onSubmit" style="width:120px">提交</el-button>
    </el-form-item>
  </el-form>

  <uppicture :aspectRatio="aspectRatio" :file="uploadfile" :position="position" @upload="upload" v-if="showBox"></uppicture>
</div>
</template>

<script>
import {
  updUserInfoImg
} from '@/api/api';
import uppicture from '@/components/public/picture'

export default {
  components: {
    uppicture
  },
  data() {
    return {
      form: {
        logoUrl: window.localStorage.saasuser ? JSON.parse(window.localStorage.saasuser).logoUrl : ''
      },
      errorImg: 'this.src="' + require('@/static/img/picture.jpg') + '"',
      uploadfile: '',
      position: '',
      showBox: false,
      aspectRatio: 1
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
    choosefile(e) {
      var _this = this;
      let files = e.target.files || e.dataTransfer.files;
      console.log(typeof files[0], files[0]);
      if (!files || !files[0]) {
        return;
      }
      this.aspectRatio = 1;
      this.position = 'cover';
      this.uploadfile = files[0];
      this.showBox = true;
    },
    upload(data) {
      if (data.position === 'cover') this.form.logoUrl = data.url;
      this.showBox = false;
    },
    onSubmit() {
      let saasuser = JSON.parse(window.localStorage.saasuser)
      if (saasuser.logoUrl !== this.form.logoUrl) {
        updUserInfoImg({
          logoUrl: this.form.logoUrl
        }).then(data => {
          if (data.success) {
            saasuser.logoUrl = this.form.logoUrl;
            window.localStorage.saasuser = JSON.stringify(saasuser);
            this.openSuccess('头像修改成功！')
            window.location.reload();
          } else {
            this.openError(data.resMsg)
          }
        })
      }
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
