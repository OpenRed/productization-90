<template>
<div style="width:100%;height:100%;">
  <div class="TopName W95">{{ThemeName}}管理</div>
  <div class="TopLine"></div>
  <div class="TopButton W95">
    <span class="TopButtonLeft">
      <el-button type="primary" @click="addresource">添加{{ThemeName}}</el-button>
    </span>
    <div class="TopButtonRight">
      <input class="TopButtonRightInput" type="text" v-model="searchTxt" placeholder="请输入关键字" v-on:input="getcourselistInput">
      <el-button type="default" style="padding: 5px 10px;" @click="getcourselistBtn">搜索</el-button>
    </div>
  </div>
  <div id="TableDiv" class="W95 Teacher_List_Table" style="overflow:auto;">
    <div class="Course_List_div" v-for="data in CourseData" v-if="hackReset">
      <div style="width:100%;height:68px;" :title="data.name">
        <div style="width:120px;height:68px;float:left;margin-right:20px;cursor: pointer;object-fit:cover;" @click="updresource(data)">
          <img :src="data.cover" :onerror="errorImg" width="100%" height="100%" alt="">
        </div>
        <div style="width:150px;height:44px;margin-top:5px;line-height:20px;float:left;" class="OverTwo">{{data.name}}</div>
        <div style="width:150px;height:20px;float:left;font-size:12px;overflow: hidden;" class="Over">主讲人：{{data.lecturerName}}</div>
      </div>
      <div style="width:100%;height:30px;">
        <div style="height:30px;float:left;line-height:30px;">
          <el-button type="text" size="mini" @click="addChapter(data.id)">添加章节</el-button>
        </div>
        <div style="height:30px;float:left;line-height:30px;margin-left:15px">
          <el-button type="text" size="mini" @click="Ondelcourse(data.id)">删除{{ThemeName}}</el-button>
        </div>
        <div style="height:30px;float:left;line-height:30px;margin-left:15px" v-if="data.liveFlag===1">
          <el-button type="text" size="mini" @click="liveset(data)">直播参数设置</el-button>
        </div>
        <!-- <div style="height:30px;float:left;line-height:30px;float:right">
          上架
          <el-switch v-model="data.open" active-color="#13ce66" inactive-color="#ff4949" @change="changedis(data)"></el-switch>
        </div> -->
        <div style="height:30px;float:right;line-height:30px;margin-left:15px">
          <span>上架 <el-switch v-model="data.open" on-text="" off-text="" @change="changedis(data)"></el-switch></span>
        </div>
      </div>
      <div style="width:100%;height:30px;">
        <div style="width:65%;height:30px;float:left;">发布时间：{{data.updatetime}}</div>
        <div style="height:30px;float:left;overflow: hidden;float:right;max-width:100px;" class="Over" v-if="data.creatorName!==undefined">发布人：{{data.creatorName}}</div>
      </div>
      <div style="display:none">{{qwe}}</div>
    </div>
    <not-content v-if="NotDis"></not-content>
  </div>

  <div class="W95" style="height: 50px;" v-if="!NotDis">
    <el-pagination style="margin:10px 0;float:right;" :page-size="Page.pgLimit" @current-change="handleCurrentChange" layout="prev, pager, next" :total="Page.pgTotalCount">
    </el-pagination>
  </div>

  <el-dialog :visible.sync="dialogVisible" title="直播参数设置" :close-on-click-modal="false" @close="CloseDialog">
    <div style="width:100%;padding: 20px 0;border:1px solid #cdcdcd;" v-if="hackReset2">
      <div style="width:calc(100% - 30px);height:300px;margin:0 auto;">
        <div class="tabletable" style="width: 33%;float:left;text-align:center;">
          <el-table :data="livePathList" height="250" :highlight-current-row="false" border>
            <el-table-column label="推流地址">
              <template slot-scope="scope">
                <span style="width:90%;">{{scope.row}}</span>
                <span class="edit_path" :disabled="btnLiveStart" @click="EditPath('livepath', scope.row)"><i class="el-icon-edit"></i></span>
                <!-- <span class="edit_path" :disabled="btnLiveStart" @click="DeletePath('livepath', scope.row)"><i class="el-icon-delete"></i></span> -->
              </template>
            </el-table-column>
          </el-table>
          <div style="margin: 10px 0;">
            <!-- <el-button size="small" round :disabled="btnLiveStart" @click="AddNewPath('livepath')">添加推流地址</el-button> -->
          </div>
        </div>
        <div class="tabletable" style="width: 33%;float:left;text-align:center;">
          <el-table :data="pullPathList" height="250" :highlight-current-row="false" border>
            <el-table-column label="拉流地址">
              <template slot-scope="scope">
                <span style="width:90%;">{{scope.row}}</span>
                <span class="edit_path" :disabled="btnLiveStart" @click="EditPath('pullpath', scope.row)"><i class="el-icon-edit"></i></span>
                <span class="edit_path" :disabled="btnLiveStart" @click="DeletePath('pullpath', scope.row)"><i class="el-icon-delete"></i></span>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin: 10px 0;">
            <el-button size="small" round :disabled="btnLiveStart" @click="AddNewPath('pullpath')">添加拉流地址</el-button>
          </div>
        </div>
        <div class="tabletable" style="width: 34%;float:left;text-align:center;">
          <el-table :data="httpHostList" height="250" :highlight-current-row="false" border>
            <el-table-column label="播放地址">
              <template slot-scope="scope">
                <span style="width:90%;">{{scope.row}}</span>
                <span class="edit_path" :disabled="btnLiveStart" @click="EditPath('httphost', scope.row)"><i class="el-icon-edit"></i></span>
                <!-- <span class="edit_path" :disabled="btnLiveStart" @click="DeletePath('httphost', scope.row)"><i class="el-icon-delete"></i></span> -->
              </template>
            </el-table-column>
          </el-table>
          <div style="margin: 10px 0;">
            <!-- <el-button size="small" round :disabled="btnLiveStart" @click="AddNewPath('httphost')">添加播放地址</el-button> -->
          </div>
        </div>
      </div>
      <div style="width:calc(100% - 0px);height:40px;margin: 10px auto; padding:0 15px;box-sizing:border-box;">
        <div style="width:calc(50% - 8px);display:inlice-block;float:left;">开始时间<el-date-picker type="datetime" placeholder="选择日期" :disabled="btnLiveStart" @change="choesetime1" :picker-options="pickerOptions1" v-model="form.begintime" style="width:calc(100% - 70px);margin-left:10px"></el-date-picker>
        </div>
        <div style="width:calc(50% - 8px);display:inlice-block;float:left;margin-left:16px;">结束时间<el-date-picker type="datetime" placeholder="选择日期" :disabled="btnLiveEnd" @change="choesetime2" :picker-options="pickerOptions2" v-model="form.endtime"
            style="width:calc(100% - 70px);margin-left:10px"></el-date-picker>
        </div>
      </div>
      <div style="margin:10px 0;text-align:center;">
        <el-button :disabled="btnLiveTest" @click="TestLive" style="width:120px;">{{TestLivename}}</el-button>
        <el-button :disabled="btnLiveStartOrEnd" @click="StartLive" style="width:120px;">{{LiveStatusname}}</el-button>
        <el-button @click="ChangeLive" type="primary" style="width:120px;">提交</el-button>
        <!-- <el-button @click="ViewLive" type="primary" style="width:120px;">{{LiveViewname}}</el-button> -->
      </div>
    </div>
  </el-dialog>
  <el-dialog :visible.sync="dialogVisible2" :title="dialogVisible2Title" size="tiny">
    <div style="width:100%;height:60px;border:1px solid #cdcdcd">
      <el-form label-width="80px" style="margin-top:10px;">
        <el-form-item label="地址">
          <el-input v-model="newpath" id="newPath" style="width:90%;" @keyup.enter.native="OnAddNewPath"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible2 = false;newpath=''">取 消</el-button>
      <el-button type="primary" @click="OnAddNewPath">提 交</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import {
  getcourse,
  updcourse,
  delcourse,
  getorganization,
  getchapter
} from '@/api/api';
import NotContent from '@/components/public/NotContent';
import {
  formatDate
} from '@/util/util';
import axios from 'axios';
export default {
  components: {
    NotContent
  },
  data() {
    return {
      value1: true,
      qwe: 0,
      searchTxt: '',
      CourseData: [],
      Page: '',
      NotDis: false,
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible2Title: '',
      oldpath: '',
      newpath: '',
      form: {
        id: '',
        name: '',
        url: '',
        Turl: '',
        begintime: '',
        endtime: '',
        liveStatus: '',
        livepath: '',
        pullPath: '',
        httpHost: ''
      },
      liveStatusname: '', // 直播开始/直播结束
      TestLivename: '', // 直播调试/结束调试
      liveViewname: '', // 观看直播/观看回放
      btnLiveTest: false, // 是否调试状态
      btnLiveStart: false, // 是否直播状态
      btnLiveStart: false, // 是否直播开始状态
      btnLiveEnd: false, // 是否直播结束状态
      btnLiveStartOrEnd: false, // 立即直播开始/立即结束直播/直播已结束按钮是否可用
      StartLivetof: false,
      hackReset: false,
      hackReset2: false,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      livePathList: [],
      pullPathList: [],
      httpHostList: [],
      errorImg: 'this.src="' + require('@/static/img/picture.jpg') + '"',
      ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : ''
    }
  },
  beforeUpdate: function() {
    var THeight = document.getElementById("TableDiv");
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  mounted() {
    this.getcourselist();
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
    hack2() {
      this.hackReset2 = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset2 = true;
      })
    },
    getcourselist(searchTxt) {
      var loginParams = {
        pgPageNum: 1
      };
      if (searchTxt !== '') loginParams['name'] = this.searchTxt;
      getcourse(loginParams).then(data => {
        // console.log(data);
        var that = this;
        if (data.success) {
          if (data.resList) {
            that.CourseData = data.resList;
            that.Page = data;
            for (var i = 0; i < that.CourseData.length; i++) {
              let course = that.CourseData[i];
              var d = new Date(course.updateTime);
              course.open = course.status === 0 ? true : false;
              course.updatetime = formatDate(d, 'yyyy-MM-dd hh:mm');
            }
            this.NotDis = false;
          } else {
            that.CourseData = [];
            this.NotDis = true;
          }
        } else {
          that.CourseData = [];
          that.openError(data.resMsg);
          this.NotDis = true;
        }
        this.hack();
      });
    },
    choesetime1() {
      if (this.form.endtime !== '') {
        if (Date.parse(this.form.begintime) > Date.parse(this.form.endtime) || Date.parse(this.form.begintime) > this.form.endtime) {
          this.openError('直播开始时间不能晚于结束时间');
          this.form.begintime = '';
        }
      }
    },
    choesetime2() {
      if (this.form.begintime !== '') {
        if (Date.parse(this.form.begintime) > Date.parse(this.form.endtime) || this.form.begintime > Date.parse(this.form.endtime)) {
          this.openError('直播结束时间不能早于开始时间');
          this.form.endtime = '';
        }
      }
    },
    liveset(data) {
      // console.log(data);
      this.form.id = data.id;
      this.form.name = data.name;
      this.form.begintime = data.beginTime == undefined ? '' : data.beginTime;
      this.form.endtime = data.endTime == undefined ? '' : data.endTime;

      // 获取直播推流地址、拉流地址、播放地址
      this.livePathList = data.live ? data.live.split(';') : [];
      this.pullPathList = data.livePull ? data.livePull.split(';') : [];
      this.httpHostList = data.httpHost ? data.httpHost.split(';') : [];

      // liveStatus 直播状态：0:未开始,1:已开始,2:已结束,3:暂停,4:调试信号
      if (data.liveStatus === 0) { // 直播未开始
        this.TestLivename = '直播调试';
        this.LiveStatusname = '立即开始直播';
        this.LiveViewname = '观看直播';
        this.btnLiveTest = false; // 可以调试
        this.btnLiveStart = false; // 启用修改直播开始时间、直播地址按钮
        this.btnLiveEnd = false; // 可以修改直播结束时间
        this.btnLiveStartOrEnd = false; // 启用立即开始直播按钮
        // this.form.begintime = '';   // 直播未开始状态开始时间为空
        // this.form.endtime = '';     // 直播未开始状态结束时间为空
      } else if (data.liveStatus === 1) { // 直播已开始
        // 是否直播开始，开始直播后rtmp地址：不可修改、开始时间：不可修改、结束时间：可以修改、调试：不可修改
        this.TestLivename = '直播调试';
        this.LiveStatusname = '立即结束直播';
        this.LiveViewname = '观看直播';
        this.btnLiveTest = true; // 禁止直播调试状态
        this.btnLiveStart = true; // 禁用修改直播开始时间、直播地址按钮
        this.btnLiveEnd = false; // 可以修改直播结束时间
        this.btnLiveStartOrEnd = false; // 启用立即结束直播按钮
      } else if (data.liveStatus === 2) { // 直播结束
        this.TestLivename = '直播调试';
        this.LiveStatusname = '直播已结束';
        this.LiveViewname = '观看回放';
        this.btnLiveTest = true; // 禁用调试按钮
        this.btnLiveStart = true; // 禁用修改直播开始时间、直播地址按钮
        this.btnLiveEnd = false; // 可以修改直播结束时间
        this.btnLiveStartOrEnd = true; // 禁用直播已结束按钮
      } else if (data.liveStatus === 4) { // 调试状态
        this.TestLivename = '结束调试';
        this.LiveStatusname = '立即开始直播';
        this.LiveViewname = '观看调试';
        this.btnLiveTest = false; // 直播调试
        this.btnLiveStart = false; // 启用修改直播开始时间、直播地址按钮
        this.btnLiveStartOrEnd = false; // 启用立即开始直播按钮
      } else {
        this.TestLivename = '直播调试';
        this.LiveStatusname = '立即开始直播';
        this.LiveViewname = '观看直播';
        this.btnLiveTest = true; // 禁用调试按钮
        this.btnLiveStart = true; // 禁用直播开始/直播结束按钮
        this.btnLiveStartOrEnd = false; // 启用立即开始直播按钮
      }

      this.form.liveStatus = data.liveStatus;
      this.hack2();
      this.dialogVisible = true;
    },
    TestLive() {
      this.livePathList.forEach(item => this.form.livepath += item + ';');
      this.pullPathList.forEach(item => this.form.pullPath += item + ';');
      this.httpHostList.forEach(item => this.form.httpHost += item + ';');
      if (this.form.livepath[this.form.livepath.length - 1] === ';') this.form.livepath = this.form.livepath.slice(0, this.form.livepath.length - 1);
      if (this.form.pullPath[this.form.pullPath.length - 1] === ';') this.form.pullPath = this.form.pullPath.slice(0, this.form.pullPath.length - 1);
      if (this.form.httpHost[this.form.httpHost.length - 1] === ';') this.form.httpHost = this.form.httpHost.slice(0, this.form.httpHost.length - 1);
      if (this.form.livepath === '') return this.openError('推流地址不能为空！');
      if (this.form.pullPath === '') return this.openError('拉流地址不能为空！');
      if (this.form.httpHost === '') return this.openError('播放地址不能为空！');

      let begintime = Number.isInteger(this.form.begintime) || this.form.begintime === '' ? this.form.begintime : this.form.begintime.getTime();
      let endtime = Number.isInteger(this.form.endtime) || this.form.endtime === '' ? this.form.endtime : this.form.endtime.getTime();

      let liveStatus = this.TestLivename === '结束调试' ? 0 : 4;
      let loginParam = {
        id: this.form.id,
        liveStatus: liveStatus,
        live: this.form.livepath,
        livePull: this.form.pullPath,
        httpHost: this.form.httpHost,
        begintime: begintime,
        endtime: endtime
      };
      updcourse(loginParam).then(data => {
        if (data.success) {
          if (data.liveStatus === 4) {
            this.TestLivename = '结束调试';
            this.openSuccess('调试开始');
          }
          if (data.liveStatus === 0) {
            this.TestLivename = '开始调试';
            this.openSuccess('调试结束');
          }
          this.form.livepath = '';
          this.form.pullPath = '';
          this.form.httpHost = '';
          this.getcourselist('');
          this.hack2();
        } else this.openError(data.resMsg);
      });
    },
    StartLive() {
      if (this.form.begintime === '') return this.openError('直播开始时间不能为空！');
      if (this.form.endtime === '') return this.openError('直播结束时间不能为空！');

      var nowtime = new Date().getTime();
      if (this.form.begintime > this.form.endtime) {
        this.openError('直播结束时间不能早于开始时间');
      } else {
        this.form.begintime = nowtime;
      }

      let begintime = Number.isInteger(this.form.begintime) || this.form.begintime === '' ? this.form.begintime : this.form.begintime.getTime();
      let endtime = Number.isInteger(this.form.endtime) || this.form.endtime === '' ? this.form.endtime : this.form.endtime.getTime();

      let liveStatus = 0;
      if (this.LiveStatusname === '立即开始直播') liveStatus = 1;
      if (this.LiveStatusname === '立即结束直播') liveStatus = 2;

      this.livePathList.forEach(item => this.form.livepath += item + ';');
      this.pullPathList.forEach(item => this.form.pullPath += item + ';');
      this.httpHostList.forEach(item => this.form.httpHost += item + ';');
      if (this.form.livepath[this.form.livepath.length - 1] === ';') this.form.livepath = this.form.livepath.slice(0, this.form.livepath.length - 1);
      if (this.form.pullPath[this.form.pullPath.length - 1] === ';') this.form.pullPath = this.form.pullPath.slice(0, this.form.pullPath.length - 1);
      if (this.form.httpHost[this.form.httpHost.length - 1] === ';') this.form.httpHost = this.form.httpHost.slice(0, this.form.httpHost.length - 1);
      if (this.form.livepath === '') return this.openError('推流地址不能为空！');
      if (this.form.pullPath === '') return this.openError('拉流地址不能为空！');
      if (this.form.httpHost === '') return this.openError('播放地址不能为空！');

      var loginParam = {
        id: this.form.id,
        liveStatus: liveStatus,
        live: this.form.livepath,
        livePull: this.form.pullPath,
        httpHost: this.form.httpHost,
        begintime: begintime,
        endtime: endtime
      };
      // console.log(loginParam);
      updcourse(loginParam).then(data => {
        if (data.success) {
          if (liveStatus === 1) {
            this.openSuccess('直播已开始');
            this.btnLiveTest = true; // 禁用开始调试按钮
            this.btnLiveStart = true; // 禁用修改直播开始时间、直播参数地址按钮
            this.btnLiveEnd = false; // 启用修改直播结束时间按钮
            this.btnLiveStartOrEnd = false; // 启用立即结束直播按钮
            this.form.liveStatus = 1;
            this.TestLivename = '开始调试';
            this.LiveStatusname = '立即结束直播';
            this.LiveViewname = '观看直播';
          } else if (liveStatus === 2) {
            this.openSuccess('直播已结束');
            this.form.liveStatus = 2;
            this.btnLiveTest = true; // 禁用开始调试按钮
            this.btnLiveStart = true; // 禁用修改直播开始时间、直播参数地址按钮
            this.btnLiveEnd = false; // 启用修改直播结束时间按钮
            this.btnLiveStartOrEnd = true; // 启用直播已结束按钮
            this.TestLivename = '开始调试';
            this.LiveStatusname = '直播已结束';
            this.LiveViewname = '观看回放';
          }

          this.form.livepath = '';
          this.form.pullPath = '';
          this.form.httpHost = '';
          this.getcourselist('');
        } else {
          this.openError(data.resMsg);
        }
      });
    },
    ChangeLive() {
      this.livePathList.forEach(item => this.form.livepath += item + ';');
      this.pullPathList.forEach(item => this.form.pullPath += item + ';');
      this.httpHostList.forEach(item => this.form.httpHost += item + ';');
      if (this.form.livepath[this.form.livepath.length - 1] === ';') this.form.livepath = this.form.livepath.slice(0, this.form.livepath.length - 1);
      if (this.form.pullPath[this.form.pullPath.length - 1] === ';') this.form.pullPath = this.form.pullPath.slice(0, this.form.pullPath.length - 1);
      if (this.form.httpHost[this.form.httpHost.length - 1] === ';') this.form.httpHost = this.form.httpHost.slice(0, this.form.httpHost.length - 1);
      if (this.form.livepath === '') return this.openError('推流地址不能为空！');
      if (this.form.pullPath === '') return this.openError('拉流地址不能为空！');
      if (this.form.httpHost === '') return this.openError('播放地址不能为空！');

      let begintime = Number.isInteger(this.form.begintime) || this.form.begintime === '' ? this.form.begintime : this.form.begintime.getTime();
      let endtime = Number.isInteger(this.form.endtime) || this.form.endtime === '' ? this.form.endtime : this.form.endtime.getTime();

      var loginParam = {
        id: this.form.id,
        live: this.form.livepath,
        livePull: this.form.pullPath,
        httpHost: this.form.httpHost,
        begintime: begintime,
        endtime: endtime
      };

      // console.log(loginParam);
      updcourse(loginParam).then(data => {
        if (data.success) {
          this.openSuccess('修改成功');
          this.dialogVisible = false;
          this.livePathList = [];
          this.pullPathList = [];
          this.httpHostList = [];
          this.form.begintime = '';
          this.form.endtime = '';
          this.form.livepath = '';
          this.form.pullPath = '';
          this.form.httpHost = '';
          this.getcourselist('');
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    ViewLive() {
      // console.log(this.httpHostList[0]);
      window.localStorage.saashttphost = this.httpHostList[0];
      this.$router.push('vod');
    },
    CloseDialog() {
      this.dialogVisible = false;
      this.livePathList = [];
      this.pullPathList = [];
      this.httpHostList = [];
      this.form.begintime = '';
      this.form.endtime = '';
      this.getcourselist('');
    },
    EditPath(path, item) {
      // console.log(path, item);
      if (this.btnLiveEnd) return this.openError('直播已开始，地址不可编辑！');
      if (this.btnLiveStart) return this.openError('直播已开始，地址不可编辑！');
      if (path === 'livepath') this.dialogVisible2Title = '编辑推流地址';
      if (path === 'pullpath') this.dialogVisible2Title = '编辑拉流地址';
      if (path === 'httphost') this.dialogVisible2Title = '编辑播放地址';
      this.oldpath = item;
      this.newpath = item;
      this.dialogVisible2 = true;
    },
    DeletePath(path, item) {
      // console.log(path, item);
      if (this.btnLiveEnd) return this.openError('直播已开始，地址不可移除！');
      if (this.btnLiveStart) return this.openError('直播已开始，地址不可移除！');
      if (path === 'livepath') this.livePathList.splice(this.livePathList.indexOf(item), 1);
      if (path === 'pullpath') this.pullPathList.splice(this.pullPathList.indexOf(item), 1);
      if (path === 'httphost') this.httpHostList.splice(this.httpHostList.indexOf(item), 1);
    },
    AddNewPath(path) {
      if (path === 'livepath') this.dialogVisible2Title = '添加推流地址';
      if (path === 'pullpath') this.dialogVisible2Title = '添加拉流地址';
      if (path === 'httphost') this.dialogVisible2Title = '添加播放地址';
      this.dialogVisible2 = true;
      this.newpath = '';
      setTimeout(function() {
        document.querySelector('#newPath input').focus();
      }, 20);
    },
    OnAddNewPath() {
      // console.log(this.newpath, this.oldpath);
      if (this.newpath === '') return this.openError('地址不能为空！')
      if (this.dialogVisible2Title === '添加推流地址') this.livePathList.push(this.newpath);
      if (this.dialogVisible2Title === '添加拉流地址') this.pullPathList.push(this.newpath);
      if (this.dialogVisible2Title === '添加播放地址') this.httpHostList.push(this.newpath);

      if (this.dialogVisible2Title === '编辑推流地址') this.livePathList.splice(this.livePathList.indexOf(this.oldpath), 1, this.newpath);
      if (this.dialogVisible2Title === '编辑拉流地址') this.pullPathList.splice(this.pullPathList.indexOf(this.oldpath), 1, this.newpath);
      if (this.dialogVisible2Title === '编辑播放地址') this.httpHostList.splice(this.httpHostList.indexOf(this.oldpath), 1, this.newpath);

      this.dialogVisible2 = false;
      this.dialogVisible2Title = ''
      this.oldpath = '';
      this.newpath = '';
      this.hack2();
    },
    addresource: function() {
      window.localStorage.setItem('CourseId', null);
      window.localStorage.setItem('saasteachername', '');
      this.$router.push('/AddCourse');
    },
    addChapter: function(id) {
      window.localStorage.setItem('CourseId', id);
      this.$router.push('/Chapter');
    },
    updresource(data) {
      // console.log(data);
      window.localStorage.setItem('saascoursewarehouse', data.warehouse);
      window.localStorage.setItem('saascourseid', data.id);
      window.localStorage.setItem('saascoursename', data.name);
      window.localStorage.setItem('saascoursedesc', data.desc);
      window.localStorage.setItem('saascoursecategory', data.category);
      window.localStorage.saascover = data.cover;
      window.localStorage.setItem('saascoursecreator', data.creator);
      window.localStorage.setItem('saascourseliveFlag', data.liveFlag);
      window.localStorage.setItem('saascoursedescType', data.descType);
      window.localStorage.setItem('saascourseattach', data.attach);
      window.localStorage.setItem('saascourselecturer', data.lecturer);
      if (data.lecturerName === undefined) {
        window.localStorage.setItem('saascourselecturerName', '');
      } else {
        window.localStorage.setItem('saascourselecturerName', data.lecturerName);
      }
      this.$router.push('/UpdCourse');
    },
    changedis(item) {
      // console.log(item);
      let status = item.open ? 0 : 1; // -1:删除, 0:上线, 1:未上线
      getchapter({
        course: item.id
      }).then(data1 => {
        if (data1.success) {
          if (data1.resList || item.liveFlag == 1) {
            updcourse({
              id: item.id,
              status: status
            }).then(data2 => {
              // console.log(data2);
              if (data2.success) {
                this.getcourselist('');
              } else {
                this.openError(data2.resMsg);
              }
            })
          } else {
            this.$confirm('请添加' + this.ThemeName + '章节?', '提示', {
              confirmButtonText: '添加章节',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              window.localStorage.setItem('CourseId', item.id);
              return this.$router.push('/Chapter');
            });
          }
        }
      });
    },
    handleCurrentChange(currentPage) {
      var loginParams = {
        name: this.searchTxt,
        pgPageNum: currentPage
      };
      getcourse(loginParams).then(data => {
        this.CourseData = data.resList;
        this.Page = data;
        var nowtime = new Date().getTime();
        for (var i = 0; i < this.CourseData.length; i++) {
          var d = new Date(this.CourseData[i].updateTime);
          this.CourseData[i].updatetime = formatDate(d, 'yyyy-MM-dd hh:mm');
          if (nowtime < this.CourseData[i].beginTime) {
            this.CourseData[i].liveStatus = 0;
            this.CourseData[i].liveStatusname = '立即开始直播';
          } else if (nowtime > this.CourseData[i].endTime) {
            this.CourseData[i].liveStatus = 2;
            this.CourseData[i].liveStatusname = '直播已结束';
          } else if (this.CourseData[i].beginTime === undefined || this.CourseData[i].endTime === undefined) {
            this.CourseData[i].liveStatus = 0;
            this.CourseData[i].liveStatusname = '立即开始直播';
          } else {
            this.CourseData[i].liveStatus = 1;
            this.CourseData[i].liveStatusname = '立即结束直播';
          }
          if (this.CourseData[i].status === 1) {
            this.CourseData[i].tofDis = false;
          } else {
            this.CourseData[i].tofDis = true;
          }
        }
      });
    },
    getsearchTxt() {
      var loginParams = {
        name: this.searchTxt,
        pgPageNum: 0
      };
      getcourse(loginParams).then(data => {
        this.CourseData = data.resList;
        this.Page = data;
        var nowtime = new Date().getTime();
        for (var i = 0; i < this.CourseData.length; i++) {
          var d = new Date(this.CourseData[i].updateTime);
          this.CourseData[i].updatetime = formatDate(d, 'yyyy-MM-dd hh:mm');
          if (nowtime < this.CourseData[i].beginTime) {
            this.CourseData[i].liveStatus = 0;
            this.CourseData[i].liveStatusname = '立即开始直播';
          } else if (nowtime > this.CourseData[i].endTime) {
            this.CourseData[i].liveStatus = 2;
            this.CourseData[i].liveStatusname = '直播已结束';
          } else if (this.CourseData[i].beginTime === undefined || this.CourseData[i].endTime === undefined) {
            this.CourseData[i].liveStatus = 0;
            this.CourseData[i].liveStatusname = '立即开始直播';
          } else {
            this.CourseData[i].liveStatus = 1;
            this.CourseData[i].liveStatusname = '立即结束直播';
          }
          if (this.CourseData[i].status === 1) {
            this.CourseData[i].tofDis = false;
          } else {
            this.CourseData[i].tofDis = true;
          }
        }
      })
    },
    Ondelcourse(id) {
      this.$confirm('确定删除该' + this.ThemeName + '?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        delcourse(id).then(data => {
          if (data.success) {
            if (this.CourseData.length === 1) {
              this.NotDis = true;
            }
            for (var i in this.CourseData) {
              if (this.CourseData[i].id === id) {
                this.CourseData.splice(i, 1);
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        })
      }).catch(() => {});
    },
    getcourselistInput() {
      this.getcourselist(this.searchTxt);
    },
    getcourselistBtn() {
      if (this.searchTxt !== '') {
        this.getcourselist(this.searchTxt);
      } else {
        this.openError('请输入关键字再进行搜索！');
      }
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
<style>
.Course_List_div {
  border-radius: 4px;
  width: 300px;
  height: 118px;
  border: 1px solid #cdcdcd;
  float: left;
  margin-right: 10px;
  margin-top: 10px;
  padding: 10px;
}

.edit_path {
  width: 6%;
  height: 100%;
  cursor: pointer;
  display: inline-block;
}

.edit_path:hover {
  background: #fff;
}
</style>
