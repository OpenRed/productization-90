<template>
<div>
  <el-dialog :visible.sync="Visible" size="small" :title="VisibleTitle" style="text-align: center;" :before-close="CancleChoose">
    <div style="position: absolute;width:20px;height:20px;top:20px;left:20px;cursor: pointer;" class="el-icon-arrow-left" @click="Back()"></div>
    <div style="width:calc(100% - 2px);height:40px;border:1px solid #cdcdcd;text-align: left;">
      <span style="line-height:40px;margin-left:10px;cursor: pointer;" v-for="fp in filepath" @click="Backpath(fp.parent)">{{fp.fileName}}<i class="el-icon-arrow-right"></i></span>
    </div>
    <div id="filedata" style="width:100%;height:300px;">
      <el-table :data="fileList" height="calc(100% - 10px)" border style="width: 100%; height: calc(100% - 10px); overflow: auto">
        <el-table-column prop="name" label="文件名">
          <template slot-scope="scope" v-if="hackReset">
            <div :class="[{ check: scope.row.checked }, 'Over']" style="cursor:pointer; text-align: left; text-indent: 15px;" @click="Choesepath(scope.row.id, scope.row.type)" @dblclick="Gopath(scope.row.id, scope.row.name, scope.row.type)">
              <img src="../../static/img/folder.png" style="width:20px;height:20px;margin-left:5px;margin-right:5px;margin-bottom:-5px" v-if="scope.row.type===5" />
              <img src="../../static/img/file.png" style="width:20px;height:20px;margin-left:5px;margin-right:5px;margin-bottom:-5px" v-if="scope.row.type!==5" />
              <span>{{scope.row.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文件大小" width="120">
          <template slot-scope="scope">
            <div v-bind:class="{ check: scope.row.checked }">
              <span v-if="scope.row.size">{{scope.row.size}}</span>
              <span v-if="scope.row.transcode===2">正在处理</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="200">
          <template slot-scope="scope" v-if="hackReset">
            <span v-bind:class="{ check: scope.row.checked }">{{scope.row.updatetime}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="Addfold" style="float:left">新建文件夹</el-button>
      <el-button type="primary" @click="dialogVisible = false" style="float:left">本地上传</el-button>
      <form enctype="multipart/form-data" id="fileform" method="post" action="/avctraining/uploadImgFile">
        <input type="file" class="Attachfile" name="files" id="locafile" multipart @change="OnUploadFile" title="点击选择本地文件" />
      </form>

      <el-button @click="CancleChoose">取 消</el-button>
      <el-button type="primary" @click="Choose" :disabled="btnChoose">选择</el-button>
    </span>
  </el-dialog>

  <el-dialog :visible.sync="dialogVisible" title="新建文件夹" size="tiny">
    <div style="width:100%;height:60px;border:1px solid #cdcdcd">
      <el-form label-width="80px" style="margin-top:10px;">
        <el-form-item label="名称">
          <el-input v-model="newName" id="newName" style="width:90%;" @keyup.enter.native="OnAddNewFold"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="OnAddNewFold">提 交</el-button>
    </span>
  </el-dialog>

  <el-dialog :visible.sync="dialogVisible2" :show-close="false" :close-on-click-modal="false" title="文件上传" size="tiny">
    <el-progress style="margin-left: calc(50% - 63px);" type="circle" :percentage="percentage"></el-progress>
    <p style="text-align:center;font-size: 18px;font-weight: bold;">{{uploadTxt}}</p>
  </el-dialog>
</div>
</template>

<script>
import {
  getattach,
  addattach
} from '@/api/api';
import {
  formatDate,
  TransFileSize
} from '@/util/util';
export default {
  props: {
    Visible: {
      type: Boolean,
      default: false
    },
    VisibleTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [], // 存储文件列表
      fileId: [], // 存储选中文件id
      fileName: [], // 存储选中文件名称
      filepath: [{
        parent: 0,
        fileName: '全部文件'
      }],
      dialogVisible: false, // 是否显示新建文件夹弹窗
      dialogVisible2: false, // 是否显示文件上传进度弹窗
      hackReset: false,
      newName: '', // 新建文件夹名称
      uploadTxt: '', // 文件上传进度提示
      percentage: 0, // 文件上传进度
      btnChoose: true, // 选择按钮是否可用
      UploadFileUrl: window.localStorage.saasUploadFileUrl ? window.localStorage.saasUploadFileUrl : ''
    }
  },
  mounted() {
    this.GetfileList(0);
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
    GetfileList(id) {
      getattach({
        parent: id
      }).then(data => {
        if (data.success) {
          this.fileList = data.resList;
          if (this.fileList !== undefined) {
            for (var i = 0; i < this.fileList.length; i++) {
              var date = new Date(this.fileList[i].updateTime);
              this.fileList[i].checked = false;
              this.fileList[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
            }
          }
        } else {
          this.openError(data.resMsg);
        }
        this.hack();
      })
    },
    Back() {
      if (this.filepath.length > 1) {
        var id = this.filepath[this.filepath.length - 2].parent;
        this.Backpath(id);
      }
    },
    Backpath(id) {
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

      this.GetfileList(id);
    },
    Choesepath(id, type) {
      if (type === 5) {
        this.btnChoose = true;
      } else {
        this.btnChoose = false;
        for (var i = 0; i < this.fileList.length; i++) {
          if (this.fileList[i].id === id) {
            this.fileId = this.fileList[i].id;
            this.fileName = this.fileList[i].name;
            this.fileList[i].checked = true;
          } else {
            this.fileList[i].checked = false;
          }
        }
        this.hack();
      }
    },
    Gopath(id, name, type) {
      if (type === 5) {
        getattach({
          parent: id
        }).then(data => {
          if (data.success) {
            this.filepath[this.filepath.length] = {
              parent: id,
              fileName: name
            }
            this.fileList = data.resList;
            if (this.fileList !== undefined) {
              for (var i = 0; i < this.fileList.length; i++) {
                var date = new Date(this.fileList[i].updateTime);
                this.fileList[i].checked = false;
                this.fileList[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        })
      }
    },
    Addfold() {
      this.dialogVisible = true;
      setTimeout(function() {
        document.querySelector('#newName input').focus();
      }, 20);
    },
    //上传文件
    OnUploadFile(e) {
      var that = this;
      that.dialogVisible2 = true;
      that.uploadTxt = '正在上传...';
      that.percentage = 0;
      console.log(this.UploadFileUrl);
      var options = {
        url: this.UploadFileUrl,
        type: 'post',
        enctype: 'multipart/form-data',
        contentType: 'application/json; charset=UTF-8', //记住加上charset=utf-8，否则Ajax请求有可能会报SCRIPT7002错误
        uploadProgress: function(event, position, total, percentComplete) { //上传的过程
          console.log(percentComplete);
          that.percentage = percentComplete;
          if (percentComplete == 100) {
            // percentComplete 上传进度，position 已上传了多少，total 总大小
            that.uploadTxt = '上传成功！';
            // console.log(percentComplete + '%', position, total, that.uploadTxt);
            setTimeout(function() {
              that.dialogVisible2 = false;
            }, 1000);
          }
        },
        error: function(err) {
          that.openError('上传失败');
        },
        success: that.successRes
      }
      that.Jq("#fileform").ajaxSubmit(options);
      //清空input，使得重复选择文件时还是触动input的change方法。
      if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
        this.Jq('#locafile').select();
        document.execCommand('Delete');
      } else {
        this.Jq('#locafile').val('')
      }
      return false;
    },
    //上传成功之后
    successRes(data) {
      // this.uploaddata = data;
      console.log('============successRes===========');
      console.log(data);
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
      console.log(fileurl, filetype, filesize);

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
            this.GetfileList(this.filepath[this.filepath.length - 1].parent);
            this.openSuccess('文件上传成功！');
          } else {
            this.openError(data1.resMsg);
          }
        })
      } else {
        this.openError(data.resMsg);
      }
    },
    OnAddNewFold() {
      if (this.newName === '') return this.openError('请输入名称！');

      var loginParams = {
        parent: this.filepath[this.filepath.length - 1].parent,
        name: this.newName,
        type: 5
      };
      console.log(loginParams);

      addattach(loginParams).then(data => {
        if (data.success) {
          this.GetfileList(this.filepath[this.filepath.length - 1].parent);
          this.newName = '';
        } else {
          this.openError(data.resMsg);
        }
        this.dialogVisible = false;
      })
    },
    Choose() {
      let data = {
        id: this.fileId,
        name: this.fileName,
        visible: false
      };
      this.$emit('choose', data); //触发 choose方法，data为向父组件传递的数据
    },
    CancleChoose() {
      this.$emit('close', false); //触发 close方法，关闭窗口
    }
  }
}
</script>

<style lang="css">
.check {
  color: rgb(32, 160, 255);
}
</style>
