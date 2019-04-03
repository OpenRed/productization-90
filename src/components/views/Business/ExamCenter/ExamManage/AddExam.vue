<template>
<div style="width:100%;height:100%;">
  <div style="background: #F5F5F5">
    <div class="TopName W95"><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="GOBack"></i>创建考试</div>
  </div>
  <div class="TopLine"></div>
  <br />
  <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="height:calc(100% - 120px);overflow-y:auto" id="form" method="post">
    <el-form-item label="考试名称" prop="name">
      <el-input v-model="form.name" style="width: 560px;" placeholder="请输入考试名称" @change="verification" autofocus></el-input>
    </el-form-item>
    <el-form-item label="考试说明">
      <el-input type="textarea" :rows="4" placeholder="请输入考试说明" @change="" v-model="form.desc" style="width: 560px;">
      </el-input>
    </el-form-item>
    <el-form-item label="考试来源">
      <el-radio v-model="radio1" label="0">线上考试</el-radio>
      <el-radio v-model="radio1" label="1">来自外部链接</el-radio>
      <el-input v-model="form.exlink" :disabled="radio1!='1'" style="width: 340px; margin-left: 10px" placeholder="请输入外部链接" @change="verification" autofocus></el-input>
    </el-form-item>

    <el-form-item label="开放时间">
      开始时间
      <el-date-picker type="datetime" placeholder="选择日期" @change="choesetime1" :picker-options="pickerOptions1" v-model="form.begintime" :editable="false" style="width: 208px;margin-left:5px">
      </el-date-picker>
      <span style="margin-left: 10px;"></span>
      结束时间
      <el-date-picker type="datetime" placeholder="选择日期" @change="choesetime2" :picker-options="pickerOptions2" v-model="form.endtime" :editable="false" style="width: 208px;margin-left:5px">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="考试封面">
      <uppicture :aspectRatio="16/9" :width="300" :source="form.cover" @upload="upload"></uppicture>
    </el-form-item>
    <el-form-item label="试卷分配方式">
      <el-radio v-model="radio2" label="0">固定试卷</el-radio>
      <el-radio v-model="radio2" label="1">随机试卷(为指定人员随机分配试卷)</el-radio>
    </el-form-item>
    <el-form-item label="选择试卷" prop="paper">
      <el-input v-model="form.paper" style="width: 476px;" @change="verification" readonly autofocus></el-input>
      <el-button type="default" style="width:80px" @click="choosePaper">选择试卷</el-button>
    </el-form-item>
    <el-form-item label="补考设置">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="(item,index) in reworkList" :label="item" :key="item" @change="checkRework(index)"></el-checkbox>
        <span style="margin-left: 15px">(为考试不及格的用户而举行的考试)</span>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="最大补考次数" v-if="checkList.indexOf('开启补考')>-1">
      <el-input v-model="form.rework" style="width: 218px;" placeholder="请输入补考次数" @change="verification" autofocus></el-input>
      <span style="margin-left: 10px">请输入非零正整数</span>
    </el-form-item>
    <el-form-item label="补考开始时间" v-if="checkList.indexOf('开启补考')>-1">
      <el-select v-model="selectvalue" placeholder="请选择" style="width: 218px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span style="margin-left: 10px" v-if="selectvalue=='3'">
        补考开始时间
        <el-date-picker type="datetime" placeholder="选择日期" @change="choesetime3" :picker-options="pickerOptions3" v-model="form.reworkBeginTime" :editable="false" style="width: 200px;margin-left:5px">
        </el-date-picker>
      </span>
    </el-form-item>
    <el-form-item label="补考结束时间" v-if="checkList.indexOf('开启补考')>-1">
      <el-date-picker type="datetime" placeholder="选择日期" @change="choesetime4" :picker-options="pickerOptions4" v-model="form.reworkEndTime" :editable="false" style="width: 218px">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="补考时间间隔" v-if="checkList.indexOf('开启补考')>-1">
      <template>
        <el-checkbox v-model="reworkInterval">开启</el-checkbox>
      </template>
      <span style="margin-left: 10px"></span>
      <el-input v-model="form.intervalHour" style="width: 50px;" :disabled="!reworkInterval" @blur="setHour" autofocus></el-input>
      <span style="margin-left: 3px">小时</span>
      <el-input v-model="form.intervalMinute" style="width: 50px;" :disabled="!reworkInterval" @blur="setMin" autofocus></el-input>
      <span style="margin-left: 3px">分钟</span>
      <span style="margin-left: 15px">(补考失败后，再次参加补考的时间间隔)</span>
    </el-form-item>
    <el-form-item label="考试提醒" v-if="checkList.indexOf('开启补考')>-1">
      <template>
        <el-checkbox v-model="Examtip">开启</el-checkbox>
      </template>
      <span style="margin-left: 10px">考试开始前</span>
      <el-input v-model="form.noticeBeforeTimer" style="width: 50px;" :disabled="!Examtip" placeholder="" @change="verification" autofocus></el-input>
      <span style="margin-left: 3px">分钟提醒用户</span>
      <br>
      <span style="color:rgb(120, 110, 110);" v-if="form.name">您有一场考试《{{form.name}}》即将在 {{form.noticeBeforeTimer||0}} 分钟后开始，别错过了考试时间~</span>
      <span style="color:rgb(120, 110, 110);">您有一场考试《xx考试》即将在 0 分钟后开始，别错过了考试时间~</span>
    </el-form-item>

    <el-form-item label="答案公布设置">
      <el-radio v-model="radio3" label="1">交卷即可查看</el-radio>
      <el-radio v-model="radio3" label="2">合格即可查看</el-radio>
      <el-radio v-model="radio3" label="3">考试结束可查看</el-radio>
      <el-radio v-model="radio3" label="4">补考结束可查看</el-radio>
    </el-form-item>

    <el-form-item label="" style="margin-left:-80px">
      <el-button type="primary" style="width:120px" @click="OnAddExam">提交</el-button>
    </el-form-item>
  </el-form>

  <!--选择试卷-->
  <el-dialog :visible.sync="dialogVisible" :title="titlename" top="5%" :before-close="closeDialog">
    <div class="Search">
      <div class="SearchRight5">
        <input v-model="searchTxt" type="text" placeholder="试卷名称" style="text-indent: 0.75em;" @input="getPaper" @keyup.enter="searchPaper">
        <el-button type="default" style="padding: 5px 10px;" @click="searchPaper">搜索</el-button>
      </div>
    </div>
    <div style="clear: both"></div>
    <br>

    <div style="width: 100%;height: 335px;overflow-x: hidden;border: 1px solid #cdcdcd;">
      <table border="1" bordercolor="#cdcdcd" style="width: 100%;text-align:center;border-collapse:collapse;">
        <tr style="background: rgb(220, 220, 220)">
          <th style="width: 20%">试卷名称</th>
          <th style="width: 20%">选择</th>
        </tr>
        <tr v-for="item in examList" v-if="hackReset">
          <td style="width: 80%">{{item.name}}</td>
          <td style="width: 20%">
            <input type="checkbox" v-if="item.isCheck" checked @click="checkPaper(item)">
            <input type="checkbox" v-else @click="checkPaper(item)">
          </td>
        </tr>
      </table>
    </div>

    <div style="height:1px; margin: 10px auto;clear: both">
      <el-button style="float:right" type="primary" size="small" @click="closeDialog">取消</el-button>
      <el-button style="float:right;margin-right: 10px;" type="primary" size="small" @click="confirmPaper">确定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
import {
  getPaperList,
  addExam
} from '@/api/api';
import uppicture from '@/components/public/picture'

export default {
  components: {
    uppicture
  },
  data() {
    return {
      loading: false,
      Gloading: false,
      NotDis: false,
      dialogVisible: false,
      form: {
        id: '',
        name: '',
        desc: '',
        from: '',
        exlink: '',
        cover: '',
        random: '',
        rework: '0',
        reworklast: '',
        reworkModel: '',
        answerShow: '',
        begintime: '',
        endtime: '',
        reworkBeginTime: '',
        reworkEndTime: '',
        intervalHour: '',
        intervalMinute: '',
        notice: '',
        noticeContent: '',
        noticeBeforeTimer: '',
        examtipTime: '',
        paper: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请输入考试名称',
          trigger: 'blur'
        }],
        paper: [{
          required: true,
          message: '请选择考试试卷',
          trigger: 'blur'
        }],
        // passrate: [
        //   { required: true, message: '请输入及格线', trigger: 'blur' },
        //   { validator: checkPassrate, trigger: 'blur' }
        // ]
      },
      reworkList: ['开启补考', '补考试卷随机分配'],
      reworkInterval: false,
      Examtip: false,
      options: [{
          value: '1',
          label: '交卷后(未及格)可补考'
        },
        {
          value: '2',
          label: '考试开放时间结束后可补考'
        },
        {
          value: '3',
          label: '自定义补考时间'
        }
      ],
      selectvalue: '1',
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
      pickerOptions3: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerOptions4: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickertof: false,
      icontof: true,
      radio1: '0',
      radio2: '0',
      radio3: '1',
      radio4: '1',
      qwe: 0,
      examList: [],
      checkList: [],
      titlename: '选择试卷',
      searchTxt: '',
      elist: [],
      checkedExam: [],
      hackReset: false,
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  mounted: function() {
    getPaperList(getPaperList({})).then(data => {
      if (data.success) this.examList = data.resList;
    });
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
    GOBack() {
      this.$router.push('Exam_List');
    },
    verification() {},
    hack() {
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
      })
    },
    getPaper() {
      getPaperList({}).then(data => {
        if (data.success) {
          this.examList = data.resList;
          this.examList.forEach(item => {
            this.checkedExam.forEach(i => {
              if (i.id == item.id) {
                item.isCheck = true;
                // item.status = '11';
              }
            });
          });
        }
      });
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
        var that = this;
        that.icontof = false;
        setTimeout(function() {
          var myicons = document.getElementById("myicons");
          that.files = objs.target.files[0];
          // console.log(that.files);
          var reader = new FileReader();
          reader.readAsDataURL(that.files);
          reader.onload = function(e) {
            myicons.src = this.result;
          }
        }, 10);
      }
    },
    upload(files) {
      this.form.cover = files;
    },
    OnAddExam() {
      if (this.form.name == '') return this.openError('请输入考试名称！');
      if (this.form.begintime == '') return this.openError('请选择考试开始时间！');
      if (this.form.endtime == '') return this.openError('请选择考试结束时间！');
      if (this.form.cover === '') {
        return this.openError('请选择考试封面');
      } else {
        if (this.form.paper == '') return this.openError('请选择考试试卷！');
        if (Date.parse(this.form.begintime)) this.form.begintime = Date.parse(this.form.begintime).toString();
        if (Date.parse(this.form.endtime)) this.form.endtime = Date.parse(this.form.endtime).toString();
        if (Date.parse(this.form.reworkBeginTime)) this.form.reworkBeginTime = Date.parse(this.form.reworkBeginTime).toString();
        if (Date.parse(this.form.reworkEndTime)) this.form.reworkEndTime = Date.parse(this.form.reworkEndTime).toString();

        this.form.cover = this.form.cover;

        this.elist = [];
        if (this.checkedExam != '') {
          this.checkedExam.forEach(item => {
            this.elist.push({
              id: item.id
            });
          });
        } else {
          this.openError('请选择试卷再提交！');
          return;
        }

        this.form.from = this.radio1.toString();
        this.form.random = this.radio2.toString();
        this.form.answerShow = this.radio3.toString();
        // if(this.form.rework=='') this.form.rework = '1';
        if (this.checkList.length != 0) {
          if (this.checkList.indexOf('开启补考') > -1) {
            if (this.checkList.indexOf('补考试卷随机分配') < 0) this.form.reworklast = '0';
            else this.form.reworklast = '1';
          }
          if (this.selectvalue == '1') this.form.reworkModel = '2';
          if (this.selectvalue == '2') this.form.reworkModel = '3';
          if (this.selectvalue == '3') {
            this.form.reworkModel = '1';
            if (this.form.reworkBeginTime == '') return this.openError('请选择补考开始时间！');
          }
          if (this.form.reworkEndTime == '') return this.openError('请选择补考结束时间！');
        }

        // 验证补考时间间隔
        if (this.selectvalue == 3) {
          if (this.form.intervalHour != '') {
            if (this.form.reworkBeginTime != '') {
              if (parseInt(this.form.intervalHour) > this.getInervalHour(this.form.endtime, this.form.reworkBeginTime)) {
                this.form.intervalHour = this.getInervalHour(this.form.endtime, this.form.reworkBeginTime).toString();
                this.form.intervalMinute = (this.getInervalMin(this.form.endtime, this.form.reworkBeginTime) - parseInt(this.form.intervalHour) * 60).toString();
                return this.openError('补考时间间隔不能大于考试结束时间和补考开始时间之差');
              }
            } else {
              return this.openError('请先选择补考开始时间！');
            }
          }
        } else {
          if (this.form.intervalHour != '') {
            if (this.form.reworkEndTime != '') {
              if (parseInt(this.form.intervalHour) > this.getInervalHour(this.form.endtime, this.form.reworkEndTime)) {
                this.form.intervalHour = this.getInervalHour(this.form.endtime, this.form.reworkEndTime).toString();
                this.form.intervalMinute = (this.getInervalMin(this.form.endtime, this.form.reworkEndTime) - parseInt(this.form.intervalHour) * 60).toString();
                return this.openError('补考时间间隔不能大于考试结束时间和补考结束时间之差')
              }
            } else {
              return this.openError('请先选择补考结束时间！');
            }
          }
        }

        if (this.reworkInterval) {
          if (this.form.intervalHour == '' && this.form.intervalMinute == '') {
            return this.openError('请设置补考时间间隔');
          }
        }

        // console.log(JSON.stringify(this.elist));
        addExam(this.form, this.elist).then(data => {
          if (data.success) {
            this.form.begintime = '', this.form.endtime = '';
            this.openSuccess('添加试卷成功！');
            this.$router.push('Exam_List');
          } else this.openError(data.resMsg);
        });
      }
    },
    successRes(jsondata) {
      var data = JSON.parse(jsondata);
      // console.log(data);

      if (data.resMsg === "success") {
        if (data.url) this.form.cover = data.url;

        this.elist = [];
        if (this.checkedExam != '') {
          this.checkedExam.forEach(item => {
            this.elist.push({
              id: item.id
            });
          });
        } else {
          this.openError('请选择试卷再提交！');
          return;
        }

        this.form.from = this.radio1.toString();
        this.form.random = this.radio2.toString();
        this.form.answerShow = this.radio3.toString();
        // if(this.form.rework=='') this.form.rework = '1';
        if (this.checkList.length != 0) {
          if (this.checkList.indexOf('开启补考') > -1) {
            if (this.checkList.indexOf('补考试卷随机分配') < 0) this.form.reworklast = '0';
            else this.form.reworklast = '1';
          }
          if (this.selectvalue == '1') this.form.reworkModel = '2';
          if (this.selectvalue == '2') this.form.reworkModel = '3';
          if (this.selectvalue == '3') {
            this.form.reworkModel = '1';
            if (this.form.reworkBeginTime == '') return this.openError('请选择补考开始时间！');
          }
          if (this.form.reworkEndTime == '') return this.openError('请选择补考结束时间！');
        }

        // 验证补考时间间隔
        if (this.selectvalue == 3) {
          if (this.form.intervalHour != '') {
            if (this.form.reworkBeginTime != '') {
              if (parseInt(this.form.intervalHour) > this.getInervalHour(this.form.endtime, this.form.reworkBeginTime)) {
                this.form.intervalHour = this.getInervalHour(this.form.endtime, this.form.reworkBeginTime).toString();
                this.form.intervalMinute = (this.getInervalMin(this.form.endtime, this.form.reworkBeginTime) - parseInt(this.form.intervalHour) * 60).toString();
                return this.openError('补考时间间隔不能大于考试结束时间和补考开始时间之差');
              }
            } else {
              return this.openError('请先选择补考开始时间！');
            }
          }
        } else {
          if (this.form.intervalHour != '') {
            if (this.form.reworkEndTime != '') {
              if (parseInt(this.form.intervalHour) > this.getInervalHour(this.form.endtime, this.form.reworkEndTime)) {
                this.form.intervalHour = this.getInervalHour(this.form.endtime, this.form.reworkEndTime).toString();
                this.form.intervalMinute = (this.getInervalMin(this.form.endtime, this.form.reworkEndTime) - parseInt(this.form.intervalHour) * 60).toString();
                return this.openError('补考时间间隔不能大于考试结束时间和补考结束时间之差')
              }
            } else {
              return this.openError('请先选择补考结束时间！');
            }
          }
        }

        if (this.reworkInterval) {
          if (this.form.intervalHour == '' && this.form.intervalMinute == '') {
            return this.openError('请设置补考时间间隔');
          }
        }

        // console.log(JSON.stringify(this.elist));
        addExam(this.form, this.elist).then(data => {
          if (data.success) {
            this.form.begintime = '', this.form.endtime = '';
            this.openSuccess('添加试卷成功！');
            this.$router.push('Exam_List');
          } else this.openError(data.resMsg);
        });
      } else this.openError(data.msg);
    },
    checkRework(index) {
      if (index == 0) {
        if (this.checkList.indexOf('开启补考') < 0) {
          this.checkList = [];
          this.hack();
        } else {
          this.checkList = [];
          this.checkList.push('开启补考');
        }
      }
      if (index == 1) {
        if (this.checkList.indexOf('开启补考') < 0) {
          this.checkList.push('开启补考');
        }
      }
      if (this.checkList.indexOf('开启补考') > -1) {
        this.form.rework = '1';
        this.hack();
      } else {
        this.form.rework = '0';
        this.hack();
      }
      // console.log(this.checkList);
    },
    choesetime1() {
      this.pickertof = true;
      if (this.form.endtime != '') {
        if (this.form.begintime > this.form.endtime) {
          this.openError('考试开始时间不能晚于结束时间');
          this.form.begintime = '';
        }
      }
    },
    choesetime2() {
      this.pickertof = true;
      if (this.form.begintime != '') {
        if (this.form.begintime > this.form.endtime) {
          this.openError('考试结束时间不能早于开始时间');
          this.form.endtime = '';
        }
      }
      if (this.form.reworkBeginTime != '') {
        if (this.form.reworkBeginTime != '') {
          if (this.form.reworkBeginTime < this.form.endtime) {
            this.form.endtime = '';
            return this.openError('考试结束时间不能晚于补考开始时间');
          }
        }
      } else {
        if (this.form.reworkEndTime != '') {
          if (this.form.reworkEndTime < this.form.endtime) {
            this.form.endtime = '';
            return this.openError('考试结束时间不能晚于补考结束时间');
          }
        }
      }
      if (this.form.reworkEndTime != '') {
        this.setHour();
        this.setMin();
      }
    },
    choesetime3() {
      this.pickertof = true;
      if (this.form.begintime != '' || this.form.endtime != '') {
        if (this.form.reworkBeginTime > this.form.reworkEndTime) {
          this.openError('补考开始时间不能晚于补考结束时间');
          this.form.reworkBeginTime = '';
          return;
        }
        if (this.form.reworkBeginTime < this.form.endtime) {
          this.openError('补考开始时间不能早于考试结束时间');
          this.form.reworkBeginTime = '';
          return;
        }
      } else {
        this.openError('请先选择考试开始时间和考试结束时间');
        this.form.reworkBeginTime = '';
      }

      if (this.reworkInterval && (this.form.intervalHour != '' || this.form.intervalHour == 0) && (this.form.intervalMinute != '' || this.form.intervalMinute == 0)) {
        this.setHour();
        this.setMin();
      }
    },
    choesetime4() {
      this.pickertof = true;
      if (this.form.begintime != '' || this.form.endtime != '') {
        if (this.form.reworkBeginTime > this.form.reworkEndTime) {
          this.openError('补考结束时间不能早于补考开始时间');
          this.form.reworkEndTime = '';
          return;
        }
        if (this.form.reworkEndTime < this.form.endtime) {
          this.openError('补考结束时间不能早于考试结束时间');
          this.form.reworkEndTime = '';
          return;
        }
      } else {
        this.openError('请先选择考试开始时间和考试结束时间');
        this.form.reworkEndTime = '';
      }
    },
    getInervalHour(startDate, endDate) {
      var ms = endDate - startDate;
      if (Date.parse(startDate)) startDate = Date.parse(startDate);
      if (Date.parse(endDate)) endDate = Date.parse(endDate);
      if (ms < 0) return 0;
      return Math.floor(ms / 1000 / 60 / 60);
    },
    getInervalMin(startDate, endDate) {
      var ms = endDate - startDate;
      if (Date.parse(startDate)) startDate = Date.parse(startDate);
      if (Date.parse(endDate)) endDate = Date.parse(endDate);
      if (ms < 0) return 0;
      return Math.floor(ms / 1000 / 60);
    },
    setHour() {
      if (this.form.reworkEndTime != '') {
        this.form.intervalHour = this.form.intervalHour.replace(/[^\d]/g, '');
        if (!isNaN(parseInt(this.form.intervalHour))) {
          if (this.form.reworkEndTime != '' && parseInt(this.form.intervalHour) > this.getInervalHour(this.form.endtime, this.form.reworkEndTime)) {
            this.form.intervalHour = this.getInervalHour(this.form.endtime, this.form.reworkEndTime).toString();
            this.form.intervalMinute = (this.getInervalMin(this.form.endtime, this.form.reworkEndTime) - parseInt(this.form.intervalHour) * 60).toString();
            return this.openError('补考时间间隔不能大于考试结束时间和补考结束时间之差')
          }
        }
      } else {
        this.form.intervalHour = '';
        this.openError('请先选择补考结束时间在设置补考间隔！');
      }
    },
    setMin() {
      if (this.form.reworkEndTime != '') {
        this.form.intervalMinute = this.form.intervalMinute.replace(/[^\d]/g, '');
        if (this.selectvalue == 3) {
          if (!isNaN(parseInt(this.form.intervalMinute))) {
            if (parseInt(this.form.intervalMinute) >= 60) {
              if (this.form.intervalHour != '') this.form.intervalHour = (parseInt(this.form.intervalHour) + Math.floor(parseInt(this.form.intervalMinute) / 60)).toString();
              else this.form.intervalHour = (Math.floor(parseInt(this.form.intervalMinute) / 60)).toString();
              if (parseInt(this.form.intervalHour) >= this.getInervalHour(this.form.endtime, this.form.reworkBeginTime)) {
                this.form.intervalHour = this.getInervalHour(this.form.endtime, this.form.reworkBeginTime).toString();
                this.form.intervalMinute = (this.getInervalMin(this.form.endtime, this.form.reworkBeginTime) - parseInt(this.form.intervalHour) * 60).toString();
                return this.openError('补考时间间隔不能大于考试结束时间和补考开始时间之差');
              } else {
                this.form.intervalMinute = (this.form.intervalMinute - Math.floor(parseInt(this.form.intervalMinute) / 60) * 60).toString();
              }
            } else {
              if (parseInt(this.form.intervalHour) == this.getInervalHour(this.form.endtime, this.form.reworkBeginTime)) {
                if (parseInt(this.form.intervalMinute) > this.getInervalMin(this.form.endtime, this.form.reworkBeginTime) - parseInt(this.form.intervalHour) * 60) {
                  this.form.intervalMinute = (this.getInervalMin(this.form.endtime, this.form.reworkBeginTime) - parseInt(this.form.intervalHour) * 60).toString();
                  return this.openError('补考时间间隔不能大于考试结束时间和补考开始时间之差');
                }
              }
            }
          }
        } else {
          if (!isNaN(parseInt(this.form.intervalMinute))) {
            if (parseInt(this.form.intervalMinute) >= 60) {
              if (this.form.intervalHour != '') this.form.intervalHour = (parseInt(this.form.intervalHour) + Math.floor(parseInt(this.form.intervalMinute) / 60)).toString();
              else this.form.intervalHour = (Math.floor(parseInt(this.form.intervalMinute) / 60)).toString();
              if (parseInt(this.form.intervalHour) > this.getInervalHour(this.form.endtime, this.form.reworkEndTime)) {
                this.form.intervalHour = this.getInervalHour(this.form.endtime, this.form.reworkEndTime).toString();
                this.form.intervalMinute = (this.getInervalMin(this.form.endtime, this.form.reworkEndTime) - parseInt(this.form.intervalHour) * 60).toString();
                return this.openError('补考时间间隔不能大于考试结束时间和补考结束时间之差');
              } else {
                this.form.intervalMinute = (parseInt(this.form.intervalMinute) - Math.floor(parseInt(this.form.intervalMinute) / 60) * 60).toString();
              }
            } else {
              if (parseInt(this.form.intervalHour) == this.getInervalHour(this.form.endtime, this.form.reworkEndTime)) {
                if (parseInt(this.form.intervalMinute) > this.getInervalMin(this.form.endtime, this.form.reworkEndTime) - parseInt(this.form.intervalHour) * 60) {
                  this.form.intervalMinute = (this.getInervalMin(this.form.endtime, this.form.reworkEndTime) - parseInt(this.form.intervalHour) * 60).toString();
                  return this.openError('补考时间间隔不能大于考试结束时间和补考结束时间之差');
                }
              }
            }
          }
        }
      } else {
        this.form.intervalMinute = '';
        this.openError('请先选择补考结束时间在设置补考间隔！');
      }
    },
    choosePaper() {
      this.getPaper();
      this.hack();
      this.dialogVisible = true;
    },
    confirmPaper() {
      this.form.paper = '';
      for (var i = 0; i < this.checkedExam.length; i++) {
        var item = this.checkedExam[i];
        if (item.status == '12') {
          item.status = '11';
        }
        if (item.status == '13') {
          this.checkedExam.splice(i, 1);
          i--;
        }
      }

      this.checkedExam.forEach(item => {
        this.form.paper += item.name + ' ';
      });
      this.dialogVisible = false;
    },
    closeDialog() {
      for (var i = 0; i < this.checkedExam.length; i++) {
        var item = this.checkedExam[i];
        if (item.status == '13') {
          item.status = '11';
        }
        if (item.status == '12') {
          this.checkedExam.splice(i, 1);
          i--;
        }
      }
      this.dialogVisible = false;
    },
    checkPaper(item) {
      // 11：新添加, 110：新添加待删除
      // 12：新添加未确定, 120：新添加未确定待删除
      // 13：新添加待删除, 130：新添加待取消待删除
      if (!item.isCheck) {
        item.isCheck = true;
        item.status = '12';
        this.checkedExam.push(item);
      } else {
        item.isCheck = false;
        this.checkedExam.forEach(i => {
          if (i.id == item.id) {
            i.status = 13;
          }
        });
      }
    },
    searchPaper() {
      if (this.searchTxt != '') {
        var temp = [];
        this.examList.forEach(item => {
          var result = item.name.match(this.searchTxt);
          if (result != null) temp.push(item);
        });
        this.examList = temp;
      } else this.openError('请先输入试卷名称再搜索相关试卷！')
    }
  }
}
</script>
<style>
.asd {
  cursor: pointer;
}
</style>
