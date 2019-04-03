<template>
<div style="width:100%;height:100%;">
  <div class="TopName W95"><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="goCourse"></i>添加章节</div>
  <div class="TopLine"></div>
  <div class="W95 TopButtonT">
    <span class="TopButtonLeft">
      <el-button type="primary" @click="addchapterclick">添加章节</el-button>
    </span>
    <div class="TopButtonRight"></div>
  </div>
  <div id="TableDiv" class="W95 Teacher_List_Table2" style="overflow:auto;margin-top:10px">
    <div v-for="data in tableData" v-if="hackReset">
      <div v-bind:class="{ checkcolor: data.tofclass }" :id="data.id" style="height:40px;line-height:40px;text-indent:10px;position: relative;cursor: pointer;">
        <div style="float:left;width:calc(100% - 300px);" @click="changedis(data.id)">
          <i v-if="data.tof" class="el-icon-arrow-down" style="text-align: center;padding-right:10px;cursor: pointer;"></i>
          <i v-else class="el-icon-arrow-right" style="text-align: center;padding-right:10px;cursor: pointer;"></i>
          <span v-if="data.tofchange">{{data.name}}</span>
          <span v-else><input type="text" @blur="updname(data.id)" v-model="data.name" :id="data.id+'upd'" /></span>
          <div style="display:none">{{qwe}}</div>
        </div>
        <div style="position: absolute;top:0px;right:10px;">
          <span v-if="data.tofclass" style="z-index:10;">
            <i class="el-icon-plus" style="margin-right:10px" @click="choeseCarousel(data.id)"></i>
            <i class="el-icon-edit" style="margin-right:10px" @click="updatehc(data.id)"></i>
            <i class="el-icon-delete" style="margin-right:10px" @click="deletehc(data.id)"></i>
          </span>
          状态
          <el-switch v-model="data.status" active-color="#13ce66" inactive-color="#ff4949" @change="qwer(data.id,data.name)"></el-switch>
        </div>
      </div>

      <el-row style="margin-top:15px;">
        <el-col :span="8" style="padding:0 10px 10px 0;" :id="data.id" :key="fd.id" v-for="fd in data.forData" v-if="data.tof">
          <el-card :body-style="{ padding: '0px' }" style="min-height: 80px;" v-if="hackReset">
            <div style="padding: 16px 16px 0 16px;">
              <div class="bottom clearfix">
                <div>
                  <span style="font-weight:bold;">目录标题</span>
                  <span style="float:right;">
                    <i class="el-icon-delete" @click="deletehc(fd.id)"></i>
                  </span>
                </div>
                <div style="margin-top:15px;font-size: 16px;height:18px;line-height:18px;">
                  <span v-if="fd.tofover" class="Over" style="width:calc(100% - 30px);display:inline-block;">{{fd.name}}</span>
                  <span v-else>
                    <input type="text" style="width:calc(100% - 35px);" @blur="updcname(fd.id)" v-model="fd.name" :id="fd.id+'over'" />
                  </span>
                  <span style="margin-left:10px;font-size:14px;">
                    <i class="el-icon-edit" @click="updatechc(fd.id)" v-if="fd.tofover" style="position:relative;top:-2px;left:-1px;"></i>
                    <i class="el-icon-edit" @click="updatechc(fd.id)" v-else></i>
                  </span>
                </div>
              </div>
            </div>
            <!-- <div style="padding: 16px 16px 0 16px;">
              <div class="card-item">
                <span style="font-weight:bold;">推送设置</span>
                <span style="margin-left:14px;color:#20a0ff;cursor:pointer">
                  <i class="el-icon-inform" @click="GotoPushCourse(fd)"></i>
                </span>
                <span style="margin-left:10px;color:#20a0ff;cursor:pointer" v-if="fd.pushFlag==1" @click="GotoCanclePush(fd)">取消推送计划</span>
              </div>
              <div class="card-item" v-if="fd.pushFlag==1">
                <span>推送时间：
                  <span v-for="item in fd.pushList" v-if="fd.pushFlag==1&&fd.pushList">
                    <span style="margin-right:10px;">
                      <span>{{item.pushTimeTrans}}</span>
                      <span v-if="item.pass" style="margin-left:10px;">已过期</span>
                    </span>
                    <span v-if="!item.pass" style="color:#20a0ff;cursor:pointer" @click="GotoEditCourse(item)">编辑推送计划</span>
                  </span>
                </span>
              </div>
              <div class="card-item">
                <span style="font-weight:bold;">考试设置</span>
                <span style="margin-left:14px;color:#20a0ff;cursor:pointer" @click="OncancleAssociateExam(data, fd)" v-if="fd.examInfo!=undefined">取消考试设置</span>
                <span style="margin-left:14px;color:#20a0ff;cursor:pointer" @click="ViewExamResult(fd)" v-if="fd.examInfo&&fd.examInfo.examend">
                  查看考试结果
                </span>
              </div>
              <div class="card-item">
                <span v-if="fd.examInfo!=undefined">考试名称：</span>
                <span style="color:#20a0ff;cursor:pointer" @click="ChooseQuestion(data.id, fd.id)" v-if="fd.examInfo==undefined">设置考试</span>
                <span v-else>{{fd.examInfo.name}}</span>
              </div>
              <div class="card-item" v-if="fd.examInfo!=undefined">
                <span style="display: block;margin-bottom: 5px">开始时间：{{fd.examInfo.begin}}</span>
                <span style="display: block;">结束时间：{{fd.examInfo.end}}</span>
              </div>
            </div> -->
          </el-card>
        </el-col>
      </el-row>
    </div>
    <not-content v-if="NotDis"></not-content>
  </div>

  <el-dialog :visible.sync="dialogVisible" title="添加章节" size="tiny">
    <div style="width:100%;height:60px;border:1px solid #cdcdcd">
      <el-form label-width="80px" style="margin-top:10px;">
        <el-form-item label="章节名称">
          <el-input v-model="form.name" style="width:90%;" @keyup.enter.native="onaddhome" id="chaptername"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onaddhome">提 交</el-button>
    </span>
  </el-dialog>

  <!-- 添加章节 -->
  <UploadFile :Visible="dialogVisible2" VisibleTitle="选择文件" @choose="ChooseFile" @close="CloseChooseFile"></UploadFile>

  <el-dialog :visible.sync="dialogVisible3" title="添加通知" style="width:100%;height:1000px;min-width:800px">
    <div style="width:100%;height:220px;border:1px solid #cdcdcd;">
      <el-form label-width="78px" style="margin-top:10px;">
        <p style="margin-left:10px;">设置时间后三分钟才会通知！</p>
        <el-form-item label="通知内容">
          <el-input v-model="informname" style="width:calc(100% - 12px);" id="informname"></el-input>
        </el-form-item>
      </el-form>
      <div style="width:98%;padding-left:10px">
        通知时间
        <el-date-picker type="datetime" placeholder="选择日期" @change="choesetime1" v-model="informbegintime" style="width:calc(100% - 75px);margin-left:8px;"></el-date-picker>
      </div>
      <div style="width:98%;margin-left:77px;margin-top:20px;">
        <el-button :disabled="btninform" type="primary" @click="submitPush">选择</el-button>
      </div>
    </div>
  </el-dialog>

  <el-dialog :visible.sync="dialogVisible4" size="small" title="考试选择" @close="">
    <div style="width:100%;height:350px;border:1px solid #cdcdcd;">
      <div class="TopButton2 W95" style="padding-top:10px">
        <div class="TopButtonRight2">
          <input class="TopButtonRightInput" type="text" placeholder="请输入关键字" v-model="searchTxt" v-on:input="getwarehouseproblemsnull" @keydown="show($event)" /><label class="el-icon-search TopButtonRightSearch" @click="getexamlist(searchTxt,0)"></label>
        </div>
      </div>
      <div style="width:96%;height:calc(100% - 98px);margin-top:10px;margin-left:2%">

        <div style="width:100%;height:100%;border:1px solid #cdcdcd;overflow-y: auto">
          <div style="width:70%;height:100%;float:left;">
            <div style="width:100%;height:40px;line-height:40px;text-align: center;background:#dcdcdc;border-right:1px solid #cdcdcd;">考试名称</div>
            <div style="width:100%;height:40px;line-height:40px;text-align: center;border-bottom:1px solid #dcdcdc;border-right:1px solid #cdcdcd;" v-for="data in examList" class="Over">{{data.name}}</div>
          </div>
          <div style="width:calc(30% - 1px);height:100%;float:left;">
            <div style="width:100%;height:40px;line-height:40px;text-align: center;background:#dcdcdc">选择</div>
            <div style="width:100%;height:40px;line-height:40px;text-align: center;border-bottom:1px solid #dcdcdc" v-for="data in examList">
              <input name="Fruit" type="radio" :value="data.id" @click="chooseExam(data)" />
            </div>
          </div>
        </div>
      </div>

      <el-pagination style="margin-right:20px;float:right;margin-top:6px" :page-size="Page.pgLimit" @current-change="handdleCurrentChange" layout="prev, pager, next, jumper" :total="Page.pgTotalCount">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible4 = false">取消</el-button>
      <el-button type="primary" @click="OnChoosePaper">选择</el-button>
    </span>
  </el-dialog>

  <el-dialog :visible.sync="dialogVisible5" title="新建文件夹" size="tiny">
    <div style="width:100%;height:60px;border:1px solid #cdcdcd">
      <el-form label-width="80px" style="margin-top:10px;">
        <el-form-item label="名称">
          <el-input v-model="newName" id="newName" style="width:90%;" @keyup.enter.native="OnAddNewFold"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible5 = false">取 消</el-button>
      <el-button type="primary" @click="OnAddNewFold">提 交</el-button>
    </span>
  </el-dialog>

  <el-dialog :visible.sync="dialogVisible6" :show-close="false" :close-on-click-modal="false" title="文件上传" size="tiny">
    <el-progress style="margin-left: calc(50% - 63px);" type="circle" :percentage="percentage"></el-progress>
    <p style="text-align:center;font-size: 18px;font-weight: bold;">{{uploadTxt}}</p>
  </el-dialog>
</div>
</template>
<script>
import {
  getchapter,
  addchapter,
  changechapter,
  getcourse,
  addhomecourse,
  delchapter,
  getattach,
  addattach,
  pushCourse,
  getExamList,
  associateExam,
  cancleAssociateExam,
  canclePushCourse
} from '@/api/api';
import NotContent from '@/components/public/NotContent';
import {
  formatDate,
  Timetrans,
  TransFileSize
} from '@/util/util';
import UploadFile from '@/components/public/UploadFile';

let id = 1000;
export default {
  components: {
    UploadFile,
    NotContent
  },
  data() {
    return {
      tofdis: [],
      updtxt: '', //修改板块名时的板块名
      operateid: '', //选中板块时的id
      changeid: '', //修改板块是所选择的id
      checkid: '', //添加ThemeName时选中的ThemeName.id
      checkname: '', //添加ThemeName时选中的ThemeName.name
      qwe: 1, //用于渲染页面的值
      CourseId: window.localStorage.getItem('CourseId'),
      stateswitch: true,
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      dialogVisible6: false,
      newName: '',
      tableData: [],
      CourseData: [],
      forData: [],
      choeseF: [],
      btnChoose: true,
      form: {
        name: ''
      },
      tofAddfold: false,
      tofAddfoldTxt: '',
      choeseT: '',
      filepath: [{
        parent: 0,
        fileName: '全部文件'
      }],
      NotDis: false,
      NotDis2: false,
      uploaddata: '',
      radio: '1',
      filename: '',
      informname: '',
      informbegintime: '',
      tofIE9: navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) <= 9,

      // add
      hackReset: false,
      Page: '',
      searchTxt: '',
      examList: [],
      examid: '',
      chapter: '',
      chapterid: '',
      pushid: '',
      editpush: false,
      uploadTxt: '',
      percentage: 0,
      ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : ''
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    } else {
      var loginParams = {
        course: window.localStorage.getItem('CourseId')
      };
      getchapter(loginParams).then(data => {
        // console.log(data);
        this.tableData = data.resList;
        if (this.tableData != undefined) {
          this.NotDis = false;
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].tof = false;
            this.tableData[i].tofclass = false;
            this.tableData[i].tofchange = true;
            if (this.tableData[i].resList !== undefined) {
              for (var j = 0; j < this.tableData[i].resList.length; j++) {
                this.tableData[i].resList[j].tofover = true;
              }
            }
            this.tableData[i].forData = this.tableData[i].resList;
            if (this.tableData[i].status === 0) {
              this.tableData[i].status = true;
            } else {
              this.tableData[i].status = false;
            }

            // add 0813
            let now = new Date();
            this.tableData[i].forData.forEach(item => {
              // let now = Date.parse(new Date());
              if (item.examInfo != undefined) {
                item.examInfo.begin = Timetrans(item.examInfo.beginTime);
                item.examInfo.end = Timetrans(item.examInfo.endTime);

                if (now > item.examInfo.reworkEndTime) {
                  item.examInfo.examend = true;
                }
              }
              if (item.pushFlag == 1 && item.pushList) {
                item.pushList.forEach(item2 => {
                  item2.pushTimeTrans = Timetrans(item2.pushTime);
                  if (now > item2.pushTime) {
                    item2.pass = true;
                  } else item2.pass = false;
                });
              }
            });
          }
        } else {
          this.NotDis = true;
        }
      });
    }
  },
  mounted() {
    this.getexamlist();
    this.hack();
  },
  computed: {
    btninform() {
      if (this.informname != '' && this.informbegintime != '') return false;
      else return true;
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
    addchapterclick() {
      this.dialogVisible = true;
      this.form.name = '';
      setTimeout(function() {
        document.querySelector('#chaptername input').focus();
      }, 20);
    },
    onaddhome() {
      var loginParams = {
        name: this.form.name,
        course: this.CourseId
      };
      addchapter(loginParams).then(data => {
        if (data.success) {
          this.dialogVisible = false;
          this.form.name = '';
          var loginParams = {
            course: this.CourseId
          };
          getchapter(loginParams).then(data => {
            this.tableData = data.resList;
            if (this.tableData != undefined) {
              this.NotDis = false;
              for (var i = 0; i < this.tableData.length; i++) {
                this.tableData[i].tof = false;
                this.tableData[i].tofclass = false;
                this.tableData[i].tofchange = true;
                if (this.tableData[i].resList !== undefined) {
                  for (var j = 0; j < this.tableData[i].resList.length; j++) {
                    this.tableData[i].resList[j].tofover = true;
                  }
                }
                this.tableData[i].forData = this.tableData[i].resList;
                if (this.tableData[i].status === 0) {
                  this.tableData[i].status = true;
                } else {
                  this.tableData[i].status = false;
                }
              }
            } else {
              this.NotDis = true;
            }
          });
        } else {
          this.openError(data.reqMsg);
        }
      });
    },
    choesetime1() {

    },

    // add methods 20180810
    hack() {
      // console.log('hack it!');
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
      })
    },
    GotoPushCourse(fd) {
      // console.log(fd);
      this.editpush = false;
      this.chapterid = fd.id;
      if (fd.pushFlag == 0 || fd.pushFlag == undefined) {
        this.dialogVisible3 = true;
        this.$nextTick(() => {
          document.querySelector('#informname .el-input__inner').focus();
          this.informname = '', this.informbegintime = '';
        });
      } else {
        if (fd.pushList.length > 0) return this.openError('当前' + this.ThemeName + '已添加推送通知！');
      }
    },
    submitPush() {
      // console.log(this.CourseId, this.chapterid, typeof this.chapterid);
      if (this.CourseId == '') return this.openError(this.ThemeName + 'id为空');
      if (this.chapterid == '') return this.openError('章节id为空');
      if (!Number.isInteger(this.informbegintime)) this.informbegintime = this.informbegintime.getTime();
      var param = {
        desc: this.informname,
        course: this.CourseId,
        chapter: this.chapterid,
        pushtime: this.informbegintime
      };

      if (this.editpush) {
        if (this.pushid == '') return this.openError('推送id为空');
        param.pushId = this.pushid;
      }
      // console.log(JSON.stringify(param));
      pushCourse(param).then(data => {
        // console.log(data);
        if (data.resCode == 0) {
          let now = new Date();
          this.tableData.forEach(item => {
            if (item.course == this.CourseId) {
              item.forData.forEach(item2 => {
                if (item2.id == this.chapterid) {
                  item2.pushFlag = 1;
                  item2.pushList = data.pushList;
                  item2.pushList.forEach(item3 => {
                    item3.pushTimeTrans = Timetrans(item3.pushTime);
                    if (now > item3.pushTime) item3.pass = true;
                    else item3.pass = false;
                  });
                }
              });
            }
          });

          if (this.editpush) this.openSuccess('编辑通知成功！');
          else this.openSuccess('添加通知成功！');
          this.dialogVisible3 = false;
          this.informname = '', this.informbegintime = '';

          this.hack();
        } else this.openError(data.resMsg);
      });
    },
    GotoEditCourse(item) {
      // console.log(item);
      this.editpush = true;
      this.chapterid = item.modeValue;
      this.pushid = item.id;
      if (!item.pass) {
        this.dialogVisible3 = true;
        this.$nextTick(() => {
          document.querySelector('#informname .el-input__inner').focus();
          if (!item.pass) {
            this.informname = item.title;
            this.informbegintime = item.pushTime;
          }
        });
      }
    },
    GotoCanclePush(fd) {
      // console.log(fd);
      this.$confirm('确定取消当前推送计划?', '提示', {
        confirmButtonText: '取消',
        cancelButtonText: '不取消',
        type: 'warning'
      }).then(() => {
        if (fd.pushList && fd.pushList.length > 0) {
          let item = fd.pushList[0];
          if (!item.pass) {
            // console.log('cancle',fd.course,item.id,item.modeValue);
            canclePushCourse({
              course: fd.course,
              pushId: item.id,
              chapter: item.modeValue
            }).then(data => {
              // console.log(data);
              if (data.resCode == 0) {
                fd.pushFlag = 0;
                fd.pushList = [];
                this.openSuccess('取消推送成功！');
                this.hack();
              } else this.openError(data.resMsg);
            });
          } else return this.openError('当前通知已被推送，不能取消！');
        }
      });
    },
    ChooseQuestion(chapter, chapterid) {
      this.chapter = chapter;
      this.chapterid = chapterid;
      this.dialogVisible4 = true;
    },
    handdleCurrentChange(currentPage) {
      this.getexamlist(this.searchTxt, currentPage);
    },
    getwarehouseproblemsnull() {
      if (this.searchTxt2 === '') {
        this.getexamlist('', 0);
      }
    },
    getexamlist() {
      getExamList({}).then(data => {
        // console.log(data);
        if (data.resCode == 0) {
          this.examList = data.resList;
        } else this.openError(data.resMsg);
      });
    },
    chooseExam(data) {
      this.examid = data.id;
    },
    OnChoosePaper() {
      if (this.CourseId == '') return this.openError(this.ThemeName + 'ID为空！');
      if (this.chapterid == '') return this.openError('章节ID为空！');
      if (this.examid == '') return this.openError('考试ID为空！');
      // console.log(this.CourseId,this.chapterid,this.examid);
      associateExam({
        course: parseInt(this.CourseId),
        chapter: parseInt(this.chapterid),
        exam: parseInt(this.examid)
      }).then(data => {
        if (data.resCode == 0) {
          // console.log(this.chapter,this.chapterid,this.examid);
          this.tableData.forEach(item => {
            if (item.id == this.chapter && item.forData) {
              item.forData.forEach(item2 => {
                if (item2.id == this.chapterid) {
                  this.examList.forEach(item3 => {
                    if (item3.id == this.examid) {
                      item2.examInfo = item3;
                      item2.examInfo.begin = Timetrans(item3.beginTime);
                      item2.examInfo.end = Timetrans(item3.endTime);

                      if (new Date() > item3.reworkEndTime) {
                        item2.examInfo['examend'] = true;
                      }
                    }
                  });
                }
              });
            }
          });
          this.openSuccess('关联成功！');
          this.dialogVisible4 = false;
          this.hack();
        } else this.openError(data.resMsg);
      });
    },
    OncancleAssociateExam(data, fd) {
      this.chapter = data.id;
      this.chapterid = fd.id;
      if (this.CourseId == '') return this.openError(this.ThemeName + 'ID为空！');
      if (this.chapterid == '') return this.openError('章节ID为空！');
      if (fd.examInfo == undefined || fd.examInfo.id == '') return this.openError('当前章节未关联考试！');

      // console.log(this.CourseId,this.chapterid,fd.examInfo.id);
      this.$confirm('确定取消关联考试?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancleAssociateExam({
          course: parseInt(this.CourseId),
          chapter: parseInt(this.chapterid),
          exam: parseInt(fd.examInfo.id)
        }).then(data => {
          if (data.resCode == 0) {
            this.openSuccess('取消关联成功！');

            this.tableData.forEach(item => {
              if (item.id == this.chapter && item.forData) {
                item.forData.forEach(item2 => {
                  if (item2.id == this.chapterid) {
                    for (let i = 0; i < this.examList.length; i++) {
                      let item = this.examList[i];
                      if (item.id == fd.examInfo.id) {
                        item2.examInfo = undefined;
                        this.hack();
                        return;
                      }
                    }
                  }
                });
              }
            });
            this.hack();
          } else this.openError(data.resMsg);
        });
      }).catch(() => {});
    },
    ViewExamResult(fd) {
      // console.log(fd);
      let params = {
        eid: fd.examInfo.id,
        channel: 1,
        channelval: fd.id
      };
      window.localStorage.setItem('sassreports', JSON.stringify(params));
      this.$router.push('/Exam_Result');
    },

    append(store, data) {
      store.append({
        id: id++,
        label: 'testtest',
        children: []
      }, data);
    },
    remove(store, data) {
      store.remove(data);
    },
    changedis(id) {
      this.operateid = id;
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === id) {
          this.tableData[i].tofclass = true;
          if (this.tableData[i].tof) {
            this.tableData[i].tof = false;
          } else {
            this.tableData[i].tof = true;
          }
          this.qwe++;
        } else {
          this.tableData[i].tofclass = false;
        }
      }
    },
    qwer(hid, hname) {
      // this.openError(1);id(必须有), name,type,status,sort
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === hid) {
          if (this.tableData[i].status) {
            this.qwe = 0;
          } else {
            this.qwe = 1;
          }
          var loginParams = {
            id: hid,
            name: hname,
            type: '',
            status: this.qwe,
            sort: '',
            category: '',
            desc: ''
          };
          changechapter(loginParams).then(data => {
            var loginParams = {
              course: this.CourseId
            };
            this.getall(loginParams);

          })
        }
      }
    },
    choeseCarousel: function() {
      this.GetfileList('parent');
      this.dialogVisible2 = true;
    },
    choeseC() {
      var isAutoSend = document.getElementsByName('Fruit');
      for (var i = 0; i < isAutoSend.length; i++) {
        if (isAutoSend[i].checked == true) {
          this.checkid = isAutoSend[i].value;
          for (var i = 0; i < this.CourseData.length; i++) {
            if (this.CourseData[i].id === parseInt(this.checkid)) {
              this.checkname = this.CourseData[i].name;
            }
          }
          this.dialogVisible2 = false;
        }
      }
      var loginParams = {
        hcid: this.operateid,
        course: this.checkid
      };
      addhomecourse(loginParams).then(data => {
        if (data.success) {
          var loginParams = {
            course: this.CourseId
          };
          this.getall(loginParams);
        } else {
          this.openError(data.reqMsg);
        }
      })
    },
    deletehc(id) {
      this.$confirm('确定删除该章节?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        delchapter(id).then(data => {
          if (data.success) {
            // console.log(data);
            var loginParams = {
              course: this.CourseId
            };
            this.getall(loginParams);


          } else {
            this.openError(data.reqMsg);
          }
        })
      }).catch(() => {});
    },
    updatehc(id) {
      // console.log(id);
      // console.log(this.tableData);
      this.changeid = id;
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === id) {
          this.tableData[i].tofchange = false;
          this.qwe++;
        } else {
          this.tableData[i].tofchange = true;
        }
      }
    },
    updname(id) {
      var c = document.getElementById(id + 'upd').value;
      if (c !== '') {
        var loginParams = {
          id: this.changeid,
          name: c,
          type: '',
          status: '',
          sort: ''
        };
        changechapter(loginParams).then(data => {
          if (data.success) {
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].id === this.changeid) {
                this.tableData[i].name = c;
              }
              this.tableData[i].tofchange = true;
            }
          } else {
            this.openError(data.reqMsg);
          }
          this.qwe++;
        })
      } else {
        var loginParams = {
          course: window.localStorage.getItem('CourseId')
        };
        getchapter(loginParams).then(data => {
          this.tableData = data.resList;
          // console.log(data);
          if (this.tableData != undefined) {
            for (var i = 0; i < this.tableData.length; i++) {
              this.tableData[i].tof = false;
              this.tableData[i].tofclass = false;
              this.tableData[i].tofchange = true;
              if (this.tableData[i].resList !== undefined) {
                for (var j = 0; j < this.tableData[i].resList.length; j++) {
                  this.tableData[i].resList[j].tofover = true;
                }
              }
              this.tableData[i].forData = this.tableData[i].resList;
              if (this.tableData[i].status === 0) {
                this.tableData[i].status = true;
              } else {
                this.tableData[i].status = false;
              }
            }
          } else {
            this.openError("该" + this.ThemeName + "下没有章节");
          }
        });
      }

    },

    updatechc(id) {
      // for(var i=0;i<this.tableData.length;i++){
      //         if(this.tableData[i].forData!==undefined){
      //             for(var j=0;j<this.tableData[i].forData.length;j++){
      //                 if(this.tableData[i].forData[j].id===id){
      //                     this.tableData[i].forData[j].tofover = false;
      //                     this.qwe++;
      //                     setTimeout(function() {
      //                         document.getElementById(id+'over').focus();
      //                     }, 50);
      //                 }else{
      //                     this.tableData[i].forData[j].tofover = true;
      //                 }
      //             }
      //         }
      // }

      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].forData !== undefined) {
          for (var j = 0; j < this.tableData[i].forData.length; j++) {
            if (this.tableData[i].forData[j].id === id) {
              this.tableData[i].forData[j].tofover = false;
              this.qwe++;
              setTimeout(function() {
                document.getElementById(id + 'over').focus();
              }, 50);
            } else {
              this.tableData[i].forData[j].tofover = true;
            }
          }
        }
      }

    },

    updcname(id) {
      var c = document.getElementById(id + 'over').value;
      if (c !== '') {
        var loginParams = {
          id: id,
          name: c,
          type: '',
          status: '',
          sort: ''
        };
        changechapter(loginParams).then(data => {
          if (data.success) {
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].forData !== undefined) {
                for (var j = 0; j < this.tableData[i].forData.length; j++) {
                  if (this.tableData[i].forData[j].id === id) {
                    this.tableData[i].forData[j].name = c;
                    this.qwe++;
                  }
                  this.tableData[i].forData[j].tofover = true;
                }
              }
            }
          } else {
            this.openError(data.reqMsg);
          }
          this.qwe++;
        })
      } else {
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].forData !== undefined) {
            for (var j = 0; j < this.tableData[i].forData.length; j++) {
              if (this.tableData[i].forData[j].id === id) {
                this.tableData[i].forData[j].tofover = true;
                this.qwe++;
              }
            }
          }
        }
      }
    },
    goCourse() {
      this.$router.push('/CourseList');
    },
    OnAttach() {
      var loginParams = {
        parent: this.filepath[this.filepath.length - 1].parent,
        name: this.tofAddfoldTxt,
        type: 5
      };
      this.tofAddfold = false;
      this.tofAddfoldTxt = '';
      if (loginParams.name !== '') {
        addattach(loginParams).then(data => {
          if (data.success) {
            this.GetfileList('child');
          } else {
            this.openError(data.resMsg);
          }
        })
      } else {
        if (this.CourseData !== []) {
          this.NotDis2 = false;
        } else {
          this.NotDis2 = true;
        }
      }
    },
    gopath(id, name, type) {
      if (type === 5) {
        // this.openError(id+"--"+name+"-"+type);
        var loginParams = {
          parent: id
        };
        getattach(loginParams).then(data => {
          if (data.success) {
            this.filepath[this.filepath.length] = {
              parent: id,
              fileName: name
            }
            this.CourseData = data.resList;
            if (this.CourseData !== undefined) {
              for (var i = 0; i < this.CourseData.length; i++) {
                var date = new Date(this.CourseData[i].updateTime);
                this.CourseData[i].tofdis = false;
                this.CourseData[i].choeseF = false;
                this.CourseData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        })
      }
    },
    back1() {
      if (this.filepath.length > 1) {
        var id = this.filepath[this.filepath.length - 2].parent;
        this.backpath(id);
      }
    },
    GetfileList(flag) {
      getattach({
        parent: flag === 'parent' ? 0 : this.filepath[this.filepath.length - 1].parent
      }).then(data => {
        if (data.success) {
          this.CourseData = data.resList;
          if (this.CourseData) {
            for (var i = 0; i < this.CourseData.length; i++) {
              var date = new Date(this.CourseData[i].updateTime);
              this.CourseData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
            }
          }
        } else {
          this.openError(data.resMsg);
        }
        this.hack();
      });
    },
    backpath(id) {
      var temp = [];
      for (var i = 0; i < this.filepath.length; i++) {
        if (this.filepath[i].parent !== id) {
          temp[i] = this.filepath[i];
        } else {
          temp[i] = this.filepath[i];
          this.filepath = [];
          this.filepath = temp;
          break;
        }
      }

      var loginParams = {
        parent: id
      };
      getattach(loginParams).then(data => {
        if (data.success) {
          this.CourseData = data.resList;
          if (this.CourseData !== undefined) {
            for (var i = 0; i < this.CourseData.length; i++) {
              var date = new Date(this.CourseData[i].updateTime);
              this.CourseData[i].choeseF = false;
              this.CourseData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
            }
          }
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    addfold() {
      this.dialogVisible5 = true;
      setTimeout(function() {
        document.querySelector('#newName input').focus();
      }, 20);
    },
    OnAddNewFold() {
      if (this.newName === '') return this.openError('请输入名称！');

      var loginParams = {
        parent: this.filepath[this.filepath.length - 1].parent,
        name: this.newName,
        type: 5
      };

      addattach(loginParams).then(data => {
        if (data.success) {
          this.GetfileList('child');
          this.newName = '';
        } else {
          this.openError(data.resMsg);
        }
        this.dialogVisible5 = false;
      })
    },
    choesepath(id, type) {
      if (type === 5) {
        this.btnChoose = true;
      } else {
        this.btnChoose = false;
        for (var i = 0; i < this.CourseData.length; i++) {
          if (this.CourseData[i].id === id) {
            this.CourseData[i].choeseF = true;
          } else {
            this.CourseData[i].choeseF = false;
          }
        }
        this.hack();
      }
    },
    ChooseFile(data) {
      var name = data.name.split('.')[0];
      var attach = data.id;

      if (name !== '' && attach !== '') {
        addchapter({
          course: this.CourseId,
          name: name,
          parent: this.operateid,
          attach: attach,
        }).then(data => {
          if (data.success) {
            this.getall({
              course: this.CourseId
            });
          } else {
            this.openError(data.resMsg);
          }
          this.dialogVisible2 = data.visible;
        });
      }
    },
    CloseChooseFile(data) {
      this.dialogVisible2 = data;
    },
    addpath() {
      var name = '';
      var attach = '';
      for (var i = 0; i < this.CourseData.length; i++) {
        if (this.CourseData[i].choeseF) {
          // name = this.CourseData[i].name;
          name = this.CourseData[i].name.split('.')[0];
          attach = this.CourseData[i].id;
        }
      }
      if (name !== '' && attach !== '') {
        var loginParams = {
          course: this.CourseId,
          name: name,
          parent: this.operateid,
          attach: attach,
        };
        addchapter(loginParams).then(data => {
          if (data.success) {
            this.dialogVisible2 = false;
            var loginParams = {
              course: this.CourseId
            };
            this.getall(loginParams);
          } else {
            this.openError(data.resMsg);
          }
        });
      }
    },
    getall(loginParams) {
      getchapter(loginParams).then(data => {
        this.tableData = data.resList;
        if (this.tableData !== undefined) {
          this.NotDis = false;
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].tof = false;
            this.tableData[i].tofclass = false;
            this.tableData[i].tofchange = true;
            if (this.tableData[i].resList !== undefined) {
              for (var j = 0; j < this.tableData[i].resList.length; j++) {
                this.tableData[i].resList[j].tofover = true;
              }
            }
            this.tableData[i].forData = this.tableData[i].resList;
            if (this.tableData[i].status === 0) {
              this.tableData[i].status = true;
            } else {
              this.tableData[i].status = false;
            }
          }
          if (id !== this.operateid) {
            this.changedis(this.operateid);
          }
        } else {
          this.NotDis = true;
        }
      });
    },
    Onaddattach() {
      var loginParams = {
        parent: this.filepath[this.filepath.length - 1].parent,
        name: this.uploaddata.filename,
        type: this.radio,
        url: this.uploaddata.url
      };
      addattach(loginParams).then(data => {
        if (data.success) {
          this.GetfileList('child');
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    successRes(data) {
      // this.uploaddata = data;
      // console.log('============successRes===========');
      // console.log(data);
      // {
      //   filename: "Arabit.png"
      //   filepath: "group1/M00/00/00/rBEAA1xzuzaAbq0kAAFeInJ5YcU388.png"
      //   filesize: 89634
      //   filetype: "png"
      //   fileurl: "http://172.17.0.3:22122/group1/M00/00/00/rBEAA1xzuzaAbq0kAAFeInJ5YcU388.png"
      //   resMsg: "upload success"
      //   success: true
      //   upload: true
      // }

      var filedata = JSON.parse(data);
      var fileurl = filedata.fileurl;
      var filetype = filedata.filetype;
      var filesize = TransFileSize(filedata.filesize);
      // console.log(fileurl, filetype, filesize);

      if (filedata.success) {
        if (filetype === 'jpg' || filetype === 'png' || filetype === 'jepg' || filetype === 'bmp' || filetype === 'gif') {
          this.radio = '1';
        } else if (filetype === 'docx' || filetype === 'ppt' || filetype === 'pdf' || filetype === 'txt' || filetype === 'html') {
          this.radio = '2';
        } else if (filetype === 'mp3' || filetype === 'mp4' || filetype === 'wav' || filetype === 'mepg') {
          this.radio = '3';
        } else {
          this.radio = '6';
        }

        var loginParams = {
          parent: this.filepath[this.filepath.length - 1].parent,
          name: filedata.filename,
          type: this.radio,
          url: fileurl,
          size: filesize
          // audioUrl: SeparateName + '.mp3', // mp3
          // min: this.uploaddata.min // mp3
        };
        // var loginParams = { parent: this.filepath[this.filepath.length-1].parent,name:this.uploaddata.filename,type:this.radio,url:this.uploaddata.url};
        addattach(loginParams).then(data1 => {
          if (data1.success) {
            this.GetfileList('child');
            this.type = '';
            this.openSuccess('文件上传成功！');
          } else {
            this.openError(data1.resMsg);
          }
        })
      } else {
        this.openError(data.resMsg);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.zxc {
  /* background: #c9c9c9; */
  color: rgb(32, 160, 255);
}

.card-item {
  margin: 0 auto 16px;
}
</style>
