<template>
<div style="width:100%;height:100%;">
  <div class="TopName W95">资源管理</div>
  <div class="TopLine"></div>
  <div class="TopButton W95">
    <span style="float:left;margin-right:10px;position: relative;">
      <el-button type="primary" style="width:100px">上传资料</el-button>
      <form id="form">
        <input type="file" class="Attachfile2" name="files" id="locafile1" @change="OnUploadFile" title="点击选择本地文件" />
      </form>
    </span>

    <div>
      <span style="float:left;margin-right:10px">
        <el-button type="primary" style="width:120px;" @click="Addoutsideurl">添加外部链接</el-button>
      </span>
      <span style="float:left;margin-right:10px">
        <el-button type="primary" style="width:100px" @click="Addfold">新建文件夹</el-button>
      </span>
      <span style="float:left;margin-right:10px">
        <el-button type="primary" style="width:100px" :disabled="btnOpen" @click="openurl">打开</el-button>
      </span>
      <span style="float:left">
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button type="primary" :disabled="btnDropdown">
            更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">复制</el-dropdown-item>
            <el-dropdown-item command="b">移动</el-dropdown-item>
            <el-dropdown-item command="c" :disabled="btnRename">重命名</el-dropdown-item>
            <el-dropdown-item command="d">删除</el-dropdown-item>
            <!-- <el-dropdown-item command="e" :disabled="btnEditFile">编辑文件类型</el-dropdown-item>
            <el-dropdown-item command="f" :disabled="btnSeparate">分离音频</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </span>
      <div class="TopButtonRight3">
        <input class="TopButtonRightInput" type="text" v-model="searchTxt" placeholder="请输入关键字" v-on:input="getSearchTxt" @keydown="show($event)">
        <el-button type="default" style="padding: 5px 10px;" @click="getFilelistBtn">搜索</el-button>
      </div>
    </div>
  </div>

  <div class="W95" style="height:40px;border-top:1px solid #cdcdcd;border-left:1px solid #cdcdcd;border-right:1px solid #cdcdcd;margin-top:10px;box-sizing: border-box;">
    <span style="margin-left:15px;">当前路径：</span>
    <span style="line-height:40px;cursor: pointer;" v-for="(fp, index) in filepath" v-if="fp.fileName!==''" @click="backpath(fp.parent, 1)">
      {{fp.fileName}}
      <i class="el-icon-arrow-right" v-if="(index + 1) !== filepath.length"></i>
    </span>
  </div>

  <div id="TableDiv" class="W95 Teacher_List_Table">
    <el-table :data="tableData" height="calc(100% - 10px)" border style="width: 100%; height: calc(100% - 10px); overflow: auto" v-if="hackReset">
      <el-table-column prop="name" label="文件名">
        <template slot-scope="scope">
          <div class="" style="cursor:pointer; text-align: left; text-indent: 15px;" @dblclick="gopath(scope.row.id, scope.row.name, scope.row.type)">
            <label>
              <input name="Fruit" type="checkbox" :checked="scope.row.checked" :disabled="scope.row.transcode===2" :value="scope.row.id" @change="Changedropdown(scope.row)" />
            </label>
            <img src="../../../../static/img/folder.png" style="width:20px;height:20px;margin-left:5px;margin-right:5px;margin-bottom:-5px" v-if="scope.row.type===5" />
            <img src="../../../../static/img/file.png" style="width:20px;height:20px;margin-left:5px;margin-right:5px;margin-bottom:-5px" v-if="scope.row.type!==5" />
            <span :class="{'color_grey':scope.row.transcode===2}">{{scope.row.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.size">{{scope.row.size}}</span>
          <span v-if="scope.row.transcode===2">正在处理</span>
        </template>
      </el-table-column>
      <el-table-column prop="updatetime" label="修改时间" width="400">
      </el-table-column>
    </el-table>
  </div>

  <el-dialog :visible.sync="dialogVisible4" :show-close="false" :close-on-click-modal="false" title="文件上传" size="tiny">
    <el-progress style="margin-left: calc(50% - 63px);" type="circle" :percentage="percentage"></el-progress>
    <p style="text-align:center;font-size: 18px;font-weight: bold;">{{uploadTxt}}</p>
  </el-dialog>

  <el-dialog :visible.sync="dialogVisible" size="small" :title="CopyOrCutName+'文件'" style="text-align: center;">
    <div style="position: absolute;width:20px;height:20px;top:20px;left:20px;cursor: pointer;" class="el-icon-arrow-left" @click="back1()"></div>
    <div style="width:calc(100% - 2px);height:40px;border:1px solid #cdcdcd;text-align: left;">
      <span style="line-height:40px;margin-left:10px;cursor: pointer;" v-for="fp in filepath" @click="backpath(fp.parent, 2)">{{fp.fileName}}<i class="el-icon-arrow-right"></i></span>
    </div>
    <div id="mydata" style="width:100%;height:300px;">
      <el-table :data="tableData2" height="calc(100% - 10px)" border style="width: 100%; height: calc(100% - 10px); overflow: auto" v-if="hackReset2">
        <el-table-column prop="name" label="文件名">
          <template slot-scope="scope">
            <div class="" style="cursor:pointer; text-align: left; text-indent: 15px;" @dblclick="gopath2(scope.row.id, scope.row.name, scope.row.type)">
              <!-- <label>
                <input name="Fruit" type="checkbox" :value="scope.row.id" />
              </label> -->
              <img src="../../../../static/img/folder.png" style="width:20px;height:20px;margin-left:5px;margin-right:5px;margin-bottom:-5px" v-if="scope.row.type===5" />
              <img src="../../../../static/img/file.png" style="width:20px;height:20px;margin-left:5px;margin-right:5px;margin-bottom:-5px" v-if="scope.row.type!==5" />
              <span>{{scope.row.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updatetime" label="修改时间" width="300">
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="Addfold" style="float:left">新建文件夹</el-button>
      <span style="float:left;margin-left:10px;position: relative;">
        <el-button type="primary" style="width:100px">本地上传</el-button>
        <form id="form2">
          <input type="file" class="Attachfile2" name="files" id="locafile2" @change="OnUploadFile2" title="点击选择本地文件" />
        </form>
      </span>
      <el-button @click="CancleCopyOrCut">取 消</el-button>
      <el-button type="primary" @click="CopyOrCut">{{CopyOrCutName}}</el-button>
    </span>
  </el-dialog>
  <el-dialog :visible.sync="dialogVisible2" title="添加外部链接" size="tiny">
    <div style="width:100%;height:60px;border:1px solid #cdcdcd">
      <el-form label-width="80px" style="margin-top:10px;">
        <el-form-item label="外部链接">
          <el-input v-model="outsideurl" id="outsidename" style="width:90%;"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible2 = false">取 消</el-button>
      <el-button type="primary" @click="OnAddoutsideurl">提 交</el-button>
    </span>
  </el-dialog>
  <el-dialog :visible.sync="dialogVisible3" title="选择编辑的文件类型" size="tiny" style="min-width:1100px;">
    <div style="height:180px;">
      <!-- file.type 类型 1:图片 2:文件(PDF等等) 3:音视频 4:URL 5:文件夹 6:其他 -->
      <div style="margin-bottom:8px">
        <el-radio v-model="radio" label="1"><span style="padding-left:10px">图片文件(jpg、png、jepg、bmp、gif等)</span></el-radio>
      </div>
      <div style="margin-bottom:8px">
        <el-radio v-model="radio" label="2"><span style="padding-left:10px">文档(docx、ppt、pdf、txt、html等)</span></el-radio>
      </div>
      <div style="margin-bottom:8px">
        <el-radio v-model="radio" label="3"><span style="padding-left:10px">音视频文件(MP3、MP4、wav、mepg等)</span></el-radio>
      </div>
      <div style="margin-bottom:8px">
        <el-radio v-model="radio" label="4"><span style="padding-left:10px">URL</span></el-radio>
      </div>
      <div style="margin-bottom:8px">
        <el-radio v-model="radio" label="6"><span style="padding-left:10px">其他文件(rar、zip等)</span></el-radio>
      </div>
      <div style="width: 100px; margin: 20px auto 0;">
        <el-button type="primary" @click="Onaddattach" style="width:100px">提 交</el-button>
      </div>
    </div>
  </el-dialog>
  <el-dialog :visible.sync="dialogVisible5" :title="dialogVisible5Title" size="tiny">
    <div style="width:100%;height:60px;border:1px solid #cdcdcd">
      <el-form label-width="80px" style="margin-top:10px;">
        <el-form-item label="名称">
          <el-input v-model="newName" id="newName" style="width:90%;" @keyup.enter.native="OnAddRename"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible5 = false">取 消</el-button>
      <el-button type="primary" @click="OnAddRename">提 交</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import {
  getattach,
  addattach,
  updattach,
  delattach,
  changeattach,
  UploadFile,
  getattachforname,
  Separated,
  Transcode,
  Removefile,
  Getfile
} from '@/api/api';
import NotContent from '@/components/public/NotContent';
import {
  formatDate,
  TransFileSize
} from '@/util/util';

export default {
  components: {
    NotContent
  },
  data() {
    return {
      UploadFileUrl: window.localStorage.saasUploadFileUrl ? window.localStorage.saasUploadFileUrl : '',
      searchTxt: '',
      dialogVisible: false, // 选择文件（复制操作）
      dialogVisible2: false, // 添加外部链接
      dialogVisible3: false, // 选择上传文件的文件类型
      dialogVisible4: false, // 文件上传进度显示
      dialogVisible5: false, // 新建文件夹/重命名操作
      dialogVisible5Title: '',
      newName: '',
      uploadTxt: '',
      tofAddfold: false,
      tofAddfoldTxt: '',
      tofAddfoldTxt2: '',
      CopyOrCutName: '',
      tableData: [],
      tableData2: [],
      filepath: [{
        parent: 0,
        fileName: '全部文件'
      }],
      outsideurl: '',
      NotDis: false,
      uploaddata: '',
      radio: '', // 编辑文件类型 1:图片 2:文件(PDF等等) 3:音视频 4:URL 5:文件夹 6:其他
      filename: '',
      Separated: '',
      SeparateId: '',
      // btnOpen: true,
      // btnDropdown: true,
      // btnRename: true,
      // btnSeparate: true,
      // btnEditFile: true,
      hackReset: false, // 刷新文件列表
      hackReset2: false, // 刷新文件列表（Dialog）
      percentage: 0,
      fileList: [], // 存储选中文件
      type: '',
      tofIE9: navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) <= 9
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  mounted() {
    this.GetfileList('parent');
    this.hack();
    this.hack2();
  },
  computed: {
    btnOpen() {
      return this.fileList.length !== 1 || (this.fileList.length && this.fileList[0].type === 5);
    },
    btnDropdown() {
      return this.fileList.length === 0;
    },
    btnRename() {
      return this.fileList.length !== 1;
    },
    btnSeparate() {
      return this.fileList.length === 1 && this.fileList[0].transcode === 1;
    },
    btnEditFile() {
      return this.fileList.length === 1 && this.fileList[0].type !== 5;
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
      // console.log('hack it！');
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
      })
    },
    hack2() {
      // console.log('hack it2！');
      this.hackReset2 = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset2 = true;
      })
    },
    Addoutsideurl() {
      this.dialogVisible2 = true;
      this.outsideurl = '';
      setTimeout(function() {
        document.querySelector('#outsidename input').focus();
      }, 20);
    },
    //添加外部链接
    OnAddoutsideurl() {
      var urllist = this.outsideurl.split('/');
      var url = '';
      if (urllist[urllist.length - 1] === '') {
        url = urllist[urllist.length - 2];
      } else {
        url = urllist[urllist.length - 1];
      }
      // console.log(url);
      var loginParams = {
        parent: this.filepath[this.filepath.length - 1].parent,
        name: url,
        type: 4,
        url: this.outsideurl
      };
      addattach(loginParams).then(data => {
        this.dialogVisible2 = false;
        if (data.success) {
          this.GetfileList('child');
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    // 新建文件夹 or 重命名文件夹/文件
    OnAddRename() {
      if (this.newName === '') return this.openError('请输入名称！');

      if (this.dialogVisible5Title === '新建文件夹') {
        var loginParams = {
          parent: this.filepath[this.filepath.length - 1].parent,
          name: this.newName,
          type: 5
        };

        addattach(loginParams).then(data => {
          if (data.success) {
            if (this.CopyOrCutName !== '') {
              this.GetfileList2();
            } else {
              this.GetfileList('child');
              this.dialogVisible5Title = '';
              this.newName = '';
            }
          } else {
            this.openError(data.resMsg);
          }
          this.dialogVisible5 = false;
        })
      } else if (this.dialogVisible5Title === '重命名') {
        if (this.fileList.length > 1) return this.openError('请勾选重命名的文件！');
        if (this.fileList.length !== 1) return this.openError('逻辑错误！请联系管理员。');
        let id = this.fileList.length === 1 ? this.fileList[0].id : ''
        changeattach({
          id: id,
          name: this.newName
        }).then(data => {
          if (data.success) {
            var id = this.filepath[this.filepath.length - 1].parent;
          } else {
            this.openError(data.resMsg);
          }
          this.dialogVisible5 = false;
          this.dialogVisible5Title = '';
          this.fileList = [];
          this.backpath(id, 1);
        })
      }
    },
    //进入文件夹
    gopath(id, name, type) {
      this.hack();
      if (this.CopyOrCutName === '') this.fileList = [];
      if (type === 5) {
        var loginParams = {
          parent: id
        };
        getattach(loginParams).then(data => {
          // console.log(data);
          if (data.success) {
            this.filepath[this.filepath.length] = {
              parent: id,
              fileName: name
            }
            this.tableData = data.resList;
            if (this.tableData !== undefined) {
              for (var i = 0; i < this.tableData.length; i++) {
                var date = new Date(this.tableData[i].updateTime);
                this.tableData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        })
      }
    },
    gopath2(id, name, type) {
      if (type === 5) {
        getattach({
          parent: id
        }).then(data => {
          // console.log(data);
          if (data.success) {
            this.filepath[this.filepath.length] = {
              parent: id,
              fileName: name
            }
            this.tableData2 = data.resList;
            if (this.tableData2 !== undefined) {
              for (var i = 0; i < this.tableData2.length; i++) {
                var date = new Date(this.tableData2[i].updateTime);
                this.tableData2[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
              }
            }
          } else {
            this.openError(data.resMsg);
          }
          this.hack2();
        })
      }
    },
    //返回文件夹
    backpath(id, type) {
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
          if (type === 1) {
            this.tableData = data.resList;
            if (data.resList.length !== 0) {
              this.NotDis = false;
              for (var i = 0; i < this.tableData.length; i++) {
                var date = new Date(this.tableData[i].updateTime);
                this.tableData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
              }
            }
            this.hack();
          }
          if (type === 2) {
            this.tableData2 = data.resList;
            if (data.resList.length !== 0) {
              this.NotDis = false;
              for (var i = 0; i < this.tableData2.length; i++) {
                var date = new Date(this.tableData2[i].updateTime);
                this.tableData2[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
              }
            }
            this.hack2();
          }
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    back1() {
      if (this.filepath.length > 1) {
        var id = this.filepath[this.filepath.length - 2].parent;
        this.backpath(id, 2);
      }
    },
    //展现输入框
    Addfold() {
      this.dialogVisible5 = true;
      setTimeout(function() {
        document.querySelector('#newName input').focus();
      }, 20);
      this.dialogVisible5Title = '新建文件夹';
    },
    //更多菜单
    handleCommand(command) {
      if (command === 'a') { // 复制
        if (this.fileList.length > 0) {
          this.CopyOrCutName = '复制';
          this.dialogVisible = true;
          this.GetfileList2();
        } else {
          return this.openError('请勾选复制的文件！');
        }
      } else if (command === 'b') { // 移动
        if (this.fileList.length > 0) {
          this.CopyOrCutName = '移动';
          this.dialogVisible = true;
          this.GetfileList2();
        } else {
          return this.openError('请勾选移动的文件！');
        }
      } else if (command === 'c') { // 重命名
        this.dialogVisible5 = true;
        this.dialogVisible5Title = '重命名';
        this.newName = this.fileList.length === 1 ? this.fileList[0].name : ''
      } else if (command === 'd') { // 删除
        this.$confirm('确定删除该文件?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '不删除',
          type: 'warning'
        }).then(() => {
          if (this.fileList.length > 0) {
            let attachIdList = []
            this.fileList.forEach(item => {
              attachIdList.push(item.id)
            })
            delattach({
              attachIdList: attachIdList
            }).then(data => {
              if (data.success) {
                if (this.filepath.length > 0) {
                  var id = this.filepath[this.filepath.length - 1].parent;
                  this.backpath(id, 1);
                  this.hack();
                }
                this.fileList = [];
              } else {
                this.openError(data.resMsg);
              }
            })
          }
        }).catch(() => {});
      } else if (command === 'e') { // 编辑文件类型
        if (!this.btnEditFile && this.fileList.length === 1) {
          this.radio = this.fileList[0].type.toString();
          this.dialogVisible3 = true;
        } else {
          return this.openError('请勾选编辑文件类型的文件！');
        }
      } else if (command === 'f') { // 分离转码
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].id === this.SeparateId) {
            this.tableData[i].transcode = 2;
          }
        }
        Transcode(this.Separated).then(data => {
          // console.log('===================');
          // console.log(this.Separated);
          // console.log(data);
          var data = JSON.parse(data);
          if (data.success) {
            var loginParams = {
              id: this.SeparateId,
              audioUrl: data.url,
              transcode: 0
            };
            changeattach(loginParams).then(data2 => {
              if (data2.success) {
                this.openSuccess('分离音频成功');
                var loginParams2 = {
                  parent: this.filepath[this.filepath.length - 1].parent
                };
                getattach(loginParams2).then(data3 => {
                  if (data3.success) {
                    this.tableData = data3.resList;
                    if (data3.resList.length !== 0) {
                      this.NotDis = false;
                      for (var i = 0; i < this.tableData.length; i++) {
                        var date = new Date(this.tableData[i].updateTime);
                        this.tableData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
                      }
                    } else {
                      if (id === 0) {
                        this.NotDis = true;
                      }
                    }
                  } else {
                    this.openError(data.resMsg);
                  }
                });
                this.hack();
              } else {
                this.openError(data2.resMsg);
              }
            })
          } else if (!data.success) {
            if (data.url === '分离失败') {
              this.openError('分离音频失败');
            } else {
              var loginParams = {
                id: this.SeparateId,
                audioUrl: data.url,
                min: data.min
              };
              changeattach(loginParams).then(data => {
                if (data.success) {
                  this.openSuccess('音频已存在');
                } else {
                  this.openError(data.resMsg);
                }
              })
            }
          } else {
            this.openError('分离音频失败');
          }
        });
      }
    },
    //修改文件名
    changename(id, name) {
      var loginParams = {
        id: id,
        name: name
      };
      changeattach(loginParams).then(data => {
        if (data.success) {
          var id = this.filepath[this.filepath.length - 1].parent;
        } else {
          this.openError(data.resMsg);
        }
        this.backpath(id, 1);
      })
    },
    //打开文件
    openurl() {
      if (this.fileList.length === 1) {
        window.open(this.fileList[0].url);
      }
    },
    //选择文件
    Changedropdown(file) {
      // file.btnRadio = true;
      let canpush = true;
      if (this.fileList.length === 0) {
        this.fileList.push(file);
      } else {
        for (let i = 0; i < this.fileList.length; i++) {
          let item = this.fileList[i];
          if (item.id === file.id) {
            this.fileList.splice(i, 1);
            canpush = false;
          }
        }
        if (canpush) this.fileList.push(file);
      }
      // console.log(this.fileList);
      // this.hack();
    },
    GetfileList(flag) {
      getattach({
        parent: flag === 'parent' ? 0 : this.filepath[this.filepath.length - 1].parent
      }).then(data => {
        if (data.success) {
          this.tableData = data.resList;
          if (this.tableData) {
            for (var i = 0; i < this.tableData.length; i++) {
              var date = new Date(this.tableData[i].updateTime);
              this.tableData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
              if (this.fileList.length > 0) {
                this.fileList.forEach(item => {
                  if (item.id === this.tableData[i].id) this.tableData[i].checked = true;
                })
              }
            }
          }
        } else {
          this.openError(data.resMsg);
        }
        this.hack();
      });
    },
    GetfileList2() {
      getattach({
        parent: this.filepath[this.filepath.length - 1].parent
      }).then(data => {
        if (data.success) {
          this.tableData2 = data.resList;
          if (this.tableData2) {
            for (var i = 0; i < this.tableData2.length; i++) {
              var date = new Date(this.tableData2[i].updateTime);
              this.tableData2[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
            }
          }
        } else {
          this.openError(data.resMsg);
        }
        this.hack2();
      });
    },
    //复制/移动文件
    CopyOrCut() {
      // console.log(this.fileList);
      if (this.fileList.length === 0) return this.openError('请选择文件再进行操作！');

      let attachidList = [];
      let parent = this.filepath[this.filepath.length - 1].parent;
      // console.log(parent);
      this.fileList.forEach(item => {
        if (item.id === parent) {
          return this.openError('不能将源文件夹：' + item.name + ' ' + this.CopyOrCutName + '到源文件夹本身！');
        }
        attachidList.push(item.id);
      })

      var loginParams = {
        parent: parent,
        attachidList: attachidList
      };
      // console.log(parent);
      // console.log(loginParams);
      if (this.CopyOrCutName === '复制') {
        addattach(loginParams).then(data => {
          if (data.success) {
            this.GetfileList('child');
            this.openSuccess('文件复制成功！');
            this.fileList = [];
            this.CopyOrCutName = '';
            this.dialogVisible = false;
          } else {
            this.openError(data.resMsg);
          }
        })
      } else if (this.CopyOrCutName === '移动') {
        changeattach(loginParams).then(data => {
          if (data.success) {
            this.GetfileList('child');
            this.openSuccess('文件移动成功！');
            this.fileList = [];
            this.CopyOrCutName = '';
            this.dialogVisible = false;
          } else {
            this.openError(data.resMsg);
          }
        })
      }
      this.hack();
    },
    CancleCopyOrCut() {
      this.dialogVisible = false;
      this.CopyOrCutName = '';
      this.GetfileList('child');
    },
    //按下回车模糊查询
    show(ev) {
      if (ev.keyCode === 13) {
        this.getSearchTxt();
      }
    },
    //模糊查询
    getSearchTxt() {
      var loginParams = {
        name: this.searchTxt,
        parent: this.filepath[this.filepath.length - 1].parent
      };
      getattachforname(loginParams).then(data => {
        if (data.success) {
          this.tableData = data.resList;
          if (this.tableData) {
            for (var i = 0; i < this.tableData.length; i++) {
              var date = new Date(this.tableData[i].updateTime);
              this.tableData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
            }
          }
        } else {
          this.openError(data.resMsg);
        }
        this.hack();
      });
    },
    getFilelistBtn() {
      if (this.searchTxt !== '') {
        this.getSearchTxt();
      } else {
        this.openError('请输入关键字再搜索！');
      }
    },
    // 编辑文件类型
    Onaddattach() {
      if (this.fileList.length === 1) this.openError('只能更改一种文件的文件类型！')
      let attachidList = [this.fileList[0].id]
      var loginParams = {
        type: this.radio,
        attachidList: attachidList
      };
      // console.log(loginParams);
      changeattach(loginParams).then(data => {
        if (data.success) {
          var loginParams = {
            parent: this.filepath[this.filepath.length - 1].parent
          };
          getattach(loginParams).then(data2 => {
            if (data2.success) {
              this.tableData = data2.resList;
              this.openSuccess('修改文件类型成功');
              this.hack();
              this.dialogVisible3 = false;
            } else {
              this.openError(data2.resMsg);
            }
          })
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    //上传成功之后
    successRes(data) {
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
      var filepath = filedata.filepath;
      var filetype = filedata.filetype;
      var filesize = TransFileSize(filedata.filesize);
      // console.log(fileurl, filetype, filesize);

      // type: 类型 1:图片,2文件(pdf等等),3:音视频,4:URL,5:文件夹,6:其他
      if (filedata.success) {
        if (filetype === 'jpg' || filetype === 'png' || filetype === 'jepg' || filetype === 'bmp' || filetype === 'gif') {
          this.radio = '1';
        } else if (filetype === 'docx' || filetype === 'ppt' || filetype === 'pdf' || filetype === 'txt' || filetype === 'html') {
          this.radio = '2';
        } else if (filetype === 'mp3' || filetype === 'mp4' || filetype === 'wav' || filetype === 'mepg' || filetype === 'flv') {
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
            if (this.type === '1') this.GetfileList('child');
            if (this.type === '2') this.GetfileList2();
            this.type = '';
            this.openSuccess('文件上传成功！');
          } else {
            this.openError(data1.resMsg);
          }
        })
      } else {
        this.openError('文件上传失败！');
      }
    },
    //上传文件
    OnUploadFile(e) {
      this.type = '1';
      let files = e.target.files || e.dataTransfer.files;
      console.log(typeof files[0], files[0]);
      if (!files || !files[0]) {
        return;
      }
      //通过FormData构造函数创建一个空对象
      var formData = new FormData();
      //可以通过append()方法来追加数据
      formData.append('files', files[0]);

      let _this = this;
      console.log(_this.UploadFileUrl);
      _this.dialogVisible4 = true;
      _this.uploadTxt = '正在上传...';
      _this.percentage = 0;
      _this.Jq.ajax(_this.UploadFileUrl, {
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        xhr: function() {
          var xhr = new XMLHttpRequest();
          //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
          xhr.upload.addEventListener('progress', function(e) {
            // console.log(e);
            // progressRate 上传进度，loaded代表上传了多少，total代表总数为多少
            var progressRate = Math.floor((e.loaded / e.total) * 100);

            _this.percentage = progressRate;  // 通过设置进度条的宽度达到效果
            if (progressRate == 100) {
              _this.uploadTxt = '上传成功！';
              setTimeout(function() {
                _this.dialogVisible4 = false;
              }, 2000);
            }
          })
          return xhr;
        },
        success(response) {
          console.log('Upload success');
          console.log(response); // '{"success":true,"resMsg":"upload success","fileurl":"http://192.168.21.196:2505/group1/M00/00/00/rBEAAlx-FXqANWmYAAgUCnKI3ng239.png","filepath":"group1/M00/00/00/rBEAAlx-FXqANWmYAAgUCnKI3ng239.png","filename":"1551766934981.png","filesize":529418,"filetype":"png","upload":true}'
          _this.successRes(response);
          _this.dialogVisible4 = false;
        },
        error() {
          console.log('上传失败！');
          _this.dialogVisible4 = false;
        }
      });

      // this.type = '1';
      // // var FormData = new FormData();
      // //当浏览器是IE9时用特殊的方法获取到文件名。
      // this.filename = '';
      // if (this.tofIE9) {
      //   var obj = document.getElementById("locafile1");
      //   obj.select();
      //   obj.blur();
      //   var filess = document.selection.createRange().text;
      //   var namelist = filess.split("\\");
      //   this.filename = namelist[namelist.length - 1]
      //   // console.log(this.filename);
      // }
      //
      // var that = this;
      // // console.log(this.saasUploadFileUrl);
      // that.dialogVisible4 = true;
      // that.uploadTxt = '正在上传...';
      // that.percentage = 0;
      // var options = {
      //   url: that.saasUploadFileUrl,
      //   type: 'post',
      //   enctype: 'multipart/form-data',
      //   uploadProgress: function(event, position, total, percentComplete) { //上传的过程
      //     that.percentage = percentComplete;
      //     if (percentComplete == 100) {
      //       // percentComplete 上传进度，position 已上传了多少，total 总大小
      //       that.uploadTxt = '上传成功！';
      //       // console.log(percentComplete + '%', position, total, that.uploadTxt);
      //       setTimeout(function() {
      //         that.dialogVisible4 = false;
      //       }, 2000);
      //     }
      //   },
      //   error: function(err) {
      //     that.openError('上传失败');
      //     that.dialogVisible4 = false;
      //   },
      //   success: that.successRes
      // }
      // that.Jq("#form").ajaxSubmit(options);
      // //清空input，使得重复选择文件时还是触动input的change方法。
      // if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
      //   this.Jq('#locafile1').select();
      //   document.execCommand('Delete');
      // } else {
      //   this.Jq('#locafile1').val('')
      // }
      // return false;
    },
    //上传文件
    OnUploadFile2(e) {
      this.type = '2';
      let files = e.target.files || e.dataTransfer.files;
      console.log(typeof files[0], files[0]);
      if (!files || !files[0]) {
        return;
      }
      //通过FormData构造函数创建一个空对象
      var formData = new FormData();
      //可以通过append()方法来追加数据
      formData.append('files', files[0]);

      let _this = this;
      console.log(_this.UploadFileUrl);
      _this.dialogVisible4 = true;
      _this.uploadTxt = '正在上传...';
      _this.percentage = 0;
      _this.Jq.ajax(_this.UploadFileUrl, {
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        xhr: function() {
          var xhr = new XMLHttpRequest();
          //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
          xhr.upload.addEventListener('progress', function(e) {
            // console.log(e);
            // progressRate 上传进度，loaded代表上传了多少，total代表总数为多少
            var progressRate = Math.floor((e.loaded / e.total) * 100);

            _this.percentage = progressRate;  // 通过设置进度条的宽度达到效果
            if (progressRate == 100) {
              _this.uploadTxt = '上传成功！';
              setTimeout(function() {
                _this.dialogVisible4 = false;
              }, 2000);
            }
          })
          return xhr;
        },
        success(response) {
          console.log('Upload success');
          console.log(response); // '{"success":true,"resMsg":"upload success","fileurl":"http://192.168.21.196:2505/group1/M00/00/00/rBEAAlx-FXqANWmYAAgUCnKI3ng239.png","filepath":"group1/M00/00/00/rBEAAlx-FXqANWmYAAgUCnKI3ng239.png","filename":"1551766934981.png","filesize":529418,"filetype":"png","upload":true}'
          _this.successRes(response);
          _this.dialogVisible4 = false;
        },
        error() {
          console.log('上传失败！');
        }
      });

      // this.type = '2';
      // // var FormData = new FormData();
      // //当浏览器是IE9时用特殊的方法获取到文件名。
      // this.filename = '';
      // if (this.tofIE9) {
      //   var obj = document.getElementById("locafile2");
      //   obj.select();
      //   obj.blur();
      //   var filess = document.selection.createRange().text;
      //   var namelist = filess.split("\\");
      //   this.filename = namelist[namelist.length - 1]
      //   // console.log(this.filename);
      // }
      //
      // var that = this;
      // // console.log(this.saasUploadFileUrl);
      // that.dialogVisible4 = true;
      // that.uploadTxt = '正在上传...';
      // that.percentage = 0;
      // var options = {
      //   url: this.saasUploadFileUrl,
      //   type: 'post',
      //   enctype: 'multipart/form-data',
      //   uploadProgress: function(event, position, total, percentComplete) { //上传的过程
      //     that.percentage = percentComplete;
      //     if (percentComplete == 100) {
      //       // percentComplete 上传进度，position 已上传了多少，total 总大小
      //       that.uploadTxt = '上传成功！';
      //       // console.log(percentComplete + '%', position, total, that.uploadTxt);
      //       setTimeout(function() {
      //         that.dialogVisible4 = false;
      //       }, 2000);
      //     }
      //   },
      //   error: function(err) {
      //     that.openError('上传失败');
      //     that.dialogVisible4 = false;
      //   },
      //   success: that.successRes
      // }
      // that.Jq("#form2").ajaxSubmit(options);
      // //清空input，使得重复选择文件时还是触动input的change方法。
      // if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
      //   this.Jq('#locafile2').select();
      //   document.execCommand('Delete');
      // } else {
      //   this.Jq('#locafile2').val('')
      // }
      // return false;
    }
  }
}
</script>
