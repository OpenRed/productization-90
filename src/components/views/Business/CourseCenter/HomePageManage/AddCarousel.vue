<template>
<div style="width:100%;height:100%;">
  <div class="TopName W95"><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="Back"></i>返回</div>
  <div class="TopLine"></div>
  <br />
  <el-form ref="form" :model="form" label-width="100px" id="form" method="post">
    <el-form-item label="轮播封面">
      <div class="show" style="width:600px;height:160px;float: left;">
        <img class="picture" :src="cover" :onerror="errorImg" width="100%" height="100%" />
      </div>
      <div class="choose upload" style="float:left;margin-left:10px;">
        <label title="选择图片" class="choose-btn">
          <input type="file" accept="image/jpg,image/jpeg,image/png" name="file" style="display:none" @change="choosefile">
          <span class="choose-file">选择图片</span>
        </label>
      </div>
    </el-form-item>
    <br />
    <el-form-item :label="ThemeName+'选择'" style="height:40px;">
      <!-- <div :title="checkname" style="width:295px;height:32px;border:1px solid #cdcdcd;float:left;text-indent: 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{checkname}}</div> -->
      <span style="width:295px;height:32px;border:1px solid #cdcdcd;float:left;text-indent: 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{choosecourse.name}}</span>
      <el-button style="width:100px;height:35px;margin-left:5px;" @click="choeseCarousel">选择{{ThemeName}}</el-button>
    </el-form-item>
    <br />
    <el-form-item label="">
      <el-button type="primary" size="large" style="width:100px" @click="Onaddbanner">提 交</el-button>
    </el-form-item>
  </el-form>
  <el-dialog :visible.sync="dialogVisible" size="small" :title="ThemeName+'选择'">
    <div style="width:100%;height:300px;border:1px solid #cdcdcd">
      <div class="TopButton2 W95" style="margin-top:10px">
        <div class="TopButtonRight2">
          <input class="TopButtonRightInput" type="text" v-model="searchTxt" placeholder="请输入关键字" v-on:input="searchCourseInput">
          <el-button type="default" style="padding: 5px 10px;" @click="searchCourseBtn">搜索</el-button>
        </div>
      </div>
      <div style="width:96%;height:calc(100% - 70px);margin-top:10px;margin-left:2%">
        <el-table :data="ResourceData" border height="100%" style="width: 100%;height:100%;">
          <el-table-column prop="name" :label="ThemeName+'名称'"></el-table-column>
          <el-table-column label="操作" width="200" v-if="hackReset">
            <template slot-scope="scope">
              <input type="checkbox" name="" :checked="scope.row.checked" :value="scope.row.id" @click="CheckCourse(scope.row)">
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-pagination style="margin-right:20px;float:right;float:left" :page-size="page.pgLimit" layout="prev, pager, next, jumper" @current-change="handleCurrentChange" :total="page.pgTotalCount">
      </el-pagination>

      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="choeseC">选 择</el-button>
    </span>
  </el-dialog>

  <uppicture :aspectRatio="aspectRatio" :file="uploadfile" :position="position" @upload="upload" v-if="showBox"></uppicture>
</div>
</template>

<script>
import {
  addbanner,
  getcourse,
  uploadImg
} from '@/api/api';
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
      cover: '',
      choosecourse: {},
      checkedCities1: [],
      // checkedCities1:[],
      ResourceData: [],
      dialogVisible: false,
      hackReset: false,
      form: {
        name: '',
        phone: ''
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
    hack() {
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
      })
    },
    Back: function() {
      this.$router.push('/Carousel');
    },
    choosefile(e) {
      var _this = this;
      let files = e.target.files || e.dataTransfer.files;
      console.log(typeof files[0], files[0]);
      if (!files || !files[0]) {
        return;
      }
      this.aspectRatio = 828/220;
      this.position = 'cover';
      this.uploadfile = files[0];
      this.showBox = true;
    },
    upload(data) {
      if (data.position === 'cover') this.cover = data.url;
      this.showBox = false;
    },
    Onaddbanner() {
      if (this.cover !== "") {
        addbanner({
          val: this.choosecourse.id,
          cover: this.cover
        }).then(data => {
          // console.log(data);
          if (data.success) {
            this.$router.push('/Carousel');
          } else {
            this.openError(data.reqMsg);
          }
        });
      } else {
        this.openError('请选择图片');
      }
    },
    CheckCourse(item) {
      this.ResourceData.forEach(item2 => {
        item2.checked = item2.id === item.id ? true : false;
      });
      this.choosecourse = item;
      this.hack();
    },
    choeseCarousel: function() {
      var loginParams = {
        name: '',
        pgPageNum: 1
      };
      getcourse(loginParams).then(data => {
        this.page = data;
        this.ResourceData = data.resList;
        this.dialogVisible = true;
        // console.log(data);
        this.hack();
      });
    },
    choeseC() {
      this.dialogVisible = false;
    },
    getsearchTxt() {
      var loginParams = {
        name: this.searchTxt,
        pgPageNum: 1
      };
      getcourse(loginParams).then(data => {
        // console.log(data);
        this.page = data;
        this.ResourceData = data.resList;
      })
    },
    searchCourseInput() {
      getcourse({
        name: this.searchTxt,
        pgPageNum: 1
      }).then(data => {
        // console.log(data);
        this.page = data;
        this.ResourceData = data.resList;
      });
    },
    searchCourseBtn(){
      if (this.searchTxt !== '') {
        getcourse({
          name: this.searchTxt,
          pgPageNum: 1
        }).then(data => {
          // console.log(data);
          this.page = data;
          this.ResourceData = data.resList;
        });
      } else {
        this.openError('请输入关键字再搜索！');
      }
    },
    handleCurrentChange(currentPage) {
      var loginParams = {
        name: this.searchTxt,
        pgPageNum: currentPage
      };
      getcourse(loginParams).then(data => {
        // console.log(data);
        this.page = data;
        this.ResourceData = data.resList;
      });
    },
    show(ev) {
      if (ev.keyCode === 13) {
        this.getsearchTxt();
      }
    }
  }
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
