<template>
<div style="width:100%;height:100%;">
  <div class="TopName W95">机构管理</div>
  <div class="TopLine"></div>
  <br />
  <el-form ref="form" :model="form" label-width="100px" id="form" method="post">
    <el-form-item label="机构名称">
      <el-input v-model="form.name" style="width: 400px;" :maxlength="50" id="name"></el-input>
    </el-form-item>
    <el-form-item label="机构简介" style="width: 500px;">
      <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="form.desc">
      </el-input>
    </el-form-item>
    <el-form-item label="是否公开">
      <el-radio v-model="form.openFlag" label="0">公开</el-radio>
      <el-radio v-model="form.openFlag" label="1">不公开</el-radio>
      <span style="margin-left: 15px; color: #000;">* 机构公开后所有用户可看到机构机构选项和对外公开{{ThemeName}}资源内容，不公开后仅内部成员可看到机构选项，但在搜索中仍可看到对外公开{{ThemeName}}资源内容</span>
      <!-- <div style="width: 150px;height:50px;display:inline-block;">
        <el-radio v-model="form.openFlag" label="0">公开</el-radio>
        <el-radio v-model="form.openFlag" label="1">不公开</el-radio>
      </div>
      <div style="height:50px;display:inline-block;">
        <span style="margin-left: 15px; color: #000;">* 机构公开后所有用户可看到机构机构选项和对外公开{{ThemeName}}资源内容，<br>不公开后仅内部成员可看到机构选项，但在搜索中仍可看到对外公开{{ThemeName}}资源内容</span>
      </div> -->
    </el-form-item>
    <el-form-item label="机构LOGO">
      <div class="show" style="width:400px;height:225px;float: left;">
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
      <el-button type="primary" style="width:120px" @click="Onupdorganization">提交</el-button>
    </el-form-item>
  </el-form>

  <uppicture :aspectRatio="aspectRatio" :file="uploadfile" :position="position" @upload="upload" v-if="showBox"></uppicture>
</div>
</template>

<script>
import {
  getorganization,
  updorganization,
  uploadImg
} from '@/api/api';
import uppicture from '@/components/public/picture'

export default {
  components: {
    uppicture
  },
  data() {
    return {
      form: {
        name: '',
        desc: '',
        openFlag: '',
        logoUrl: window.localStorage.saasorg ? JSON.parse(window.localStorage.saasorg).logoUrl : ''
      },
      ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : '',
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
    getorganization().then(data => {
      if (data.success) {
        if (data.name !== '') this.form.name = data.name;
        if (data.desc !== '') this.form.desc = data.desc;
        if (data.logoUrl !== '') this.form.logoUrl = data.logoUrl;
        if (data.openFlag !== '') this.form.openFlag = data.openFlag.toString();
      } else {
        return this.openError(data.resMsg);
      }
    })
  },
  mounted() {
    setTimeout(function() {
      document.querySelector('#name input').focus();
    }, 20)
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
      this.aspectRatio = 16/9;
      this.position = 'cover';
      this.uploadfile = files[0];
      this.showBox = true;
    },
    upload(data) {
      if (data.position === 'cover') this.form.logoUrl = data.url;
      this.showBox = false;
    },
    Onupdorganization() {
      console.log(this.form);
      updorganization(this.form).then(data => {
        if (data.success) {
          this.openSuccess('修改成功');
          var orgList = JSON.parse(window.localStorage.saasorgList);
          var org = JSON.parse(window.localStorage.saasorg);
          var oid = parseInt(window.localStorage.saasoid);

          for (var i in orgList) {
            if (orgList[i].id === oid) {
              orgList[i].name = this.form.name;
              orgList[i].desc = this.form.desc;
              orgList[i].logoUrl = this.form.logoUrl;
              window.localStorage.saasorgList = JSON.stringify(orgList);

              org.name = this.form.name;
              org.desc = this.form.desc;
              org.logoUrl = this.form.logoUrl;
              window.localStorage.saasorg = JSON.stringify(org);
              window.location.reload();
            }
          }
        } else {
          this.openError(data.resMsg);
        }
      })
      // if (this.form.logoUrl === "") {
      //   return this.openError('机构Logo不能为空！')
      // } else {
      //
      // }
    }
  }
}
</script>
