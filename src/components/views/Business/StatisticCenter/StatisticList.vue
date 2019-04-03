<template>
<div style="width:100%;height:100%;">
  <div>
    <div class="TopName W95">{{ThemeName}}统计</div>
  </div>
  <div class="TopLine"></div>
  <div class="TopButtonT W95">
    <div class="TopButtonRight2">
      <input class="TopButtonRightInput" v-model="searchTxt" v-on:input="getcourses" @keydown="show($event)" type="text" :placeholder="ThemeName+'名称'" /><label class="el-icon-search TopButtonRightSearch" @click="getsearchTxt"></label>
      <span style="float:right;margin-right:5px;margin-top:4px">
        <el-dropdown size="mini" trigger="click" @command="handleCommand" style="border:1px solid #cdcdcd;width:150px;height:24px;cursor: pointer;">
          <span class="el-dropdown-link" style="display:block;height:24px;line-height:24px;padding-left:5px">
            {{liveFlagName}}<i class="el-icon-arrow-down el-icon--right" style="margin-left:70px"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="2">全部{{ThemeName}}</el-dropdown-item>
            <el-dropdown-item command="1">直播{{ThemeName}}</el-dropdown-item>
            <el-dropdown-item command="0">点播{{ThemeName}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>
  </div>
  <div id="TableDiv" class="W95 Teacher_List_Table">
    <el-table :data="Page.resList" height="calc(100% - 10px)" border style="width: 100%; height: calc(100% - 10px); overflow: auto">
      <el-table-column prop="course" :label="ThemeName+'id'" width="200">
      </el-table-column>
      <el-table-column prop="name" :label="ThemeName+'名称'">
      </el-table-column>
      <el-table-column prop="liveName" :label="ThemeName+'类型'" width="200">
      </el-table-column>
      <el-table-column label="总点击量" width="200">
        <template slot-scope="scope">
          <span style="cursor: pointer;color:#409EFF" @click="showpeople(scope.row.course)">{{scope.row.peopleCount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="chapterCount" :label="ThemeName+'章节数'" width="200">
      </el-table-column>
      <el-table-column prop="collerCount" label="收藏人数" width="200">
      </el-table-column>
    </el-table>
  </div>

  <el-pagination style="margin-right:20px;float:right" :page-size="Page.pgLimit" @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :total="Page.pgTotalCount">
  </el-pagination>

  <el-dialog :visible.sync="dialogVisible" title="参与用户统计" style="width:100%;height:100%;" size="large">
    <div style="width:100%;border-top:1px solid #cdcdcd;margin-top:-20px"></div>
    <div class="TopButtonRight2" style="margin-top:10px">
      <input class="TopButtonRightInput" v-model="searchTxtdialog" v-on:input="getcoursesdialog" @keydown="show($event)" type="text" placeholder="姓名、昵称" /><label class="el-icon-search TopButtonRightSearch" @click="getsearchTxtdialog"></label>
      <span style="float:right;margin-right:5px;margin-top:4px">
        <el-dropdown size="mini" trigger="click" @command="handleCommanddialog" style="border:1px solid #cdcdcd;width:150px;height:24px;cursor: pointer;">
          <span class="el-dropdown-link" style="line-height:24px;padding-left:5px">
            {{liveFlagNamedialog}}<i class="el-icon-arrow-down el-icon--right" style="margin-left:98px"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="2">全部</el-dropdown-item>
            <el-dropdown-item command="0">用户</el-dropdown-item>
            <el-dropdown-item command="1">游客</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>
    <div style="width: 100%;height:300px;overflow-y: auto;border:1px solid #cdcdcd;margin-top:6px" v-loading="Gloadingdialog" element-loading-text="加载中。。。" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <div style="width:calc(100% - 2px);height:40px;line-height:40px;text-align: center">
        <div style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">姓名/昵称</div>
        <div class='ListBorder'></div>
        <div style="float:left;width:calc(18% - 4px);height:100%;border-bottom:1px solid #cdcdcd;">进入时间</div>
        <div class='ListBorder'></div>
        <div style="float:left;width:17%;height:100%;border-bottom:1px solid #cdcdcd;">离开时间</div>
        <div class='ListBorder'></div>
        <div style="float:left;width:25%;height:100%;border-bottom:1px solid #cdcdcd;">进入地点</div>
        <div class='ListBorder'></div>
        <div style="float:left;width:25%;height:100%;border-bottom:1px solid #cdcdcd;">离开地点</div>

        <span v-for="data in tableDatadialog">
          <div v-if="data.tof" style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;" class="Over">游客</div>
          <div v-else style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;" class="Over">{{data.username}}/{{data.nickName}}</div>
          <div class='ListBorder'></div>
          <div style="float:left;width:calc(18% - 4px);height:100%;border-bottom:1px solid #cdcdcd;" class="Over" :title="data.name">{{data.createTime}}</div>
          <div class='ListBorder'></div>
          <div style="float:left;width:17%;height:100%;border-bottom:1px solid #cdcdcd;" :title="data.outTime" class="Over">{{data.outTime}}</div>
          <div class='ListBorder'></div>
          <div style="float:left;width:25%;height:100%;border-bottom:1px solid #cdcdcd;" :title="data.address" class="Over">{{data.address}}</div>
          <div class='ListBorder'></div>
          <div style="float:left;width:25%;height:100%;border-bottom:1px solid #cdcdcd;" :title="data.address" class="Over">{{data.address}}</div>
        </span>
      </div>
    </div>
    <el-pagination style="margin-right:20px;float:right;margin-bottom:10px;margin-top:10px" :page-size="Pagedialog.pgLimit" @current-change="handleCurrentChangedialog" layout="prev, pager, next, jumper" :total="Pagedialog.pgTotalCount">
    </el-pagination>
  </el-dialog>
</div>
</template>

<script>
import {
  getvisit,
  getvisituser
} from '@/api/api';
import {
  formatDate
} from '@/util/util';
export default {
  data() {
    return {
      tableDatadialog: [],
      Gloading: true,
      Gloadingdialog: true,
      searchTxt: '',
      searchTxtdialog: '',
      qwe: 0,
      Page: {},
      Pagedialog: '',
      liveFlagName: '全部课程',
      liveFlagNamedialog: '全部',
      dialogVisible: false,
      choesecourse: '',
      usertof: '2',
      ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : ''
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    } else {
      var loginParams = {
        pgPageNum: 1
      };
      getvisit(loginParams).then(data => {
        if (data.resList !== undefined) {
          this.Page = data;
          for (var i = 0; i < this.Page.resList.length; i++) {
            if (this.Page.resList[i].liveFlag === 0) {
              this.Page.resList[i].liveName = '点播';
            } else {
              this.Page.resList[i].liveName = '直播';
            }
          }
          this.Gloading = false;
        } else {
          this.Page = {};
          this.Gloading = false;
        }
      })
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
    showpeople(course) {
      this.choesecourse = course;
      this.dialogVisible = true;
      var loginParams = {
        course: this.choesecourse,
        pgPageNum: 1
      };
      getvisituser(loginParams).then(data => {
        // console.log(data);
        this.tableDatadialog = [];
        if (data.resList !== undefined) {
          this.tableDatadialog = data.resList;
          this.Pagedialog = data;
          for (var i = 0; i < this.tableDatadialog.length; i++) {
            if (this.tableDatadialog[i].username === undefined && this.tableDatadialog[i].nickName === undefined) {
              this.tableDatadialog[i].tof = true;
            } else {
              this.tableDatadialog[i].tof = false;
            }
            if (this.tableDatadialog[i].createTime !== undefined) {
              var date = new Date(this.tableDatadialog[i].createTime);
              this.tableDatadialog[i].createTime = formatDate(date, 'yyyy-MM-dd hh:mm')
            } else {
              this.tableDatadialog[i].createTime = '';
            }
            if (this.tableDatadialog[i].outTime !== undefined) {
              var date = new Date(this.tableDatadialog[i].outTime);
              this.tableDatadialog[i].outTime = formatDate(date, 'yyyy-MM-dd hh:mm')
            } else {
              this.tableDatadialog[i].outTime = '';
            }
          }
        }
        this.Gloadingdialog = false;
      })
    },
    handleCommand(command) {
      var loginParams = '';
      if (command === '2') {
        this.liveFlagName = '全部课程';
        loginParams = {
          name: this.searchTxt,
          pgPageNum: 1
        };
      } else if (command === '1') {
        this.liveFlagName = '直播课程';
        loginParams = {
          name: this.searchTxt,
          pgPageNum: 1,
          liveFlag: command
        };
      } else {
        this.liveFlagName = '点播课程';
        loginParams = {
          name: this.searchTxt,
          pgPageNum: 1,
          liveFlag: command
        };
      }
      getvisit(loginParams).then(data => {
        if (data.resList !== undefined) {
          this.Page = data;
          for (var i = 0; i < this.Page.resList.length; i++) {
            if (this.Page.resList[i].liveFlag === 0) {
              this.Page.resList[i].liveName = '点播';
            } else {
              this.Page.resList[i].liveName = '直播';
            }
          }
          this.Gloading = false;
        } else {
          this.Page = {};
        }
      })
    },
    handleCommanddialog(command) {
      var loginParams = '';
      if (command === '2') {
        this.usertof = command;
        this.liveFlagNamedialog = '全部';
        loginParams = {
          course: this.choesecourse,
          username: this.searchTxtdialog,
          pgPageNum: 1
        };
      } else if (command === '1') {
        this.usertof = command;
        this.liveFlagNamedialog = '游客';
        loginParams = {
          course: this.choesecourse,
          username: this.searchTxtdialog,
          pgPageNum: 1,
          type: command
        };
      } else {
        this.usertof = command;
        this.liveFlagNamedialog = '用户';
        loginParams = {
          course: this.choesecourse,
          username: this.searchTxtdialog,
          pgPageNum: 1,
          type: command
        };
      }
      getvisituser(loginParams).then(data => {
        this.tableDatadialog = [];
        if (data.resList !== undefined) {
          this.tableDatadialog = data.resList;
          this.Pagedialog = data;
          for (var i = 0; i < this.tableDatadialog.length; i++) {
            if (this.tableDatadialog[i].username === undefined && this.tableDatadialog[i].nickName === undefined) {
              this.tableDatadialog[i].tof = true;
            } else {
              this.tableDatadialog[i].tof = false;
            }
            if (this.tableDatadialog[i].createTime !== undefined) {
              var date = new Date(this.tableDatadialog[i].createTime);
              this.tableDatadialog[i].createTime = formatDate(date, 'yyyy-MM-dd hh:mm')
            } else {
              this.tableDatadialog[i].createTime = '';
            }
            if (this.tableDatadialog[i].outTime !== undefined) {
              var date = new Date(this.tableDatadialog[i].outTime);
              this.tableDatadialog[i].outTime = formatDate(date, 'yyyy-MM-dd hh:mm')
            } else {
              this.tableDatadialog[i].outTime = '';
            }
          }
        }
        this.Gloadingdialog = false;
      })
    },
    getcourses() {
      if (this.searchTxt === '') {
        if (this.liveFlagNamedialog === '全部课程') {
          var loginParams = {
            pgPageNum: 1
          };
        } else if (this.liveFlagNamedialog === '直播课程') {
          var loginParams = {
            pgPageNum: 1,
            liveFlag: 1
          };
        } else if (this.liveFlagNamedialog === '点播课程') {
          var loginParams = {
            pgPageNum: 1,
            liveFlag: 1
          };
        }
        getvisit(loginParams).then(data => {
          if (data.resList !== undefined) {
            this.Page = data;
            for (var i = 0; i < this.Page.resList.length; i++) {
              if (this.Page.resList[i].liveFlag === 0) {
                this.Page.resList[i].liveName = '点播';
              } else {
                this.Page.resList[i].liveName = '直播';
              }
            }
            this.Gloading = false;
          } else {
            this.Page = {};
          }
        })
      }
    },
    getcoursesdialog() {
      if (this.searchTxtdialog === '') {
        if (this.liveFlagNamedialog === '全部') {
          var loginParams = {
            course: this.choesecourse,
            pgPageNum: 1
          };
        } else if (this.liveFlagNamedialog === '用户') {
          var loginParams = {
            course: this.choesecourse,
            pgPageNum: 1,
            type: 0
          };
        } else if (this.liveFlagNamedialog === '游客') {
          var loginParams = {
            course: this.choesecourse,
            pgPageNum: 1,
            type: 1
          };
        }
        getvisituser(loginParams).then(data => {
          this.tableDatadialog = [];
          if (data.resList !== undefined) {
            this.tableDatadialog = data.resList;
            this.Pagedialog = data;
            for (var i = 0; i < this.tableDatadialog.length; i++) {
              if (this.tableDatadialog[i].username === undefined && this.tableDatadialog[i].nickName === undefined) {
                this.tableDatadialog[i].tof = true;
              } else {
                this.tableDatadialog[i].tof = false;
              }
              if (this.tableDatadialog[i].createTime !== undefined) {
                var date = new Date(this.tableDatadialog[i].createTime);
                this.tableDatadialog[i].createTime = formatDate(date, 'yyyy-MM-dd hh:mm')
              } else {
                this.tableDatadialog[i].createTime = '';
              }
              if (this.tableDatadialog[i].outTime !== undefined) {
                var date = new Date(this.tableDatadialog[i].outTime);
                this.tableDatadialog[i].outTime = formatDate(date, 'yyyy-MM-dd hh:mm')
              } else {
                this.tableDatadialog[i].outTime = '';
              }
            }
          }
          this.Gloadingdialog = false;
        })
      }
    },
    handleCurrentChange(currentPage) {
      var loginParams = {
        name: this.searchTxt,
        pgPageNum: currentPage
      };
      getvisit(loginParams).then(data => {
        if (data.resList !== undefined) {
          this.Page = data;
          for (var i = 0; i < this.Page.resList.length; i++) {
            if (this.Page.resList[i].liveFlag === 0) {
              this.Page.resList[i].liveName = '点播';
            } else {
              this.Page.resList[i].liveName = '直播';
            }
          }
          this.Gloading = false;
        } else {
          this.Page = {};
        }
      })
    },
    handleCurrentChangedialog(currentPage) {
      var loginParams = {
        course: this.choesecourse,
        username: this.searchTxt,
        pgPageNum: currentPage,
        type: this.usertof
      };
      // console.log('test');
      getvisituser(loginParams).then(data => {
        this.tableDatadialog = [];
        if (data.resList !== undefined) {
          this.tableDatadialog = data.resList;
          this.Pagedialog = data;
          for (var i = 0; i < this.tableDatadialog.length; i++) {
            if (this.tableDatadialog[i].username === undefined && this.tableDatadialog[i].nickName === undefined) {
              this.tableDatadialog[i].tof = true;
            } else {
              this.tableDatadialog[i].tof = false;
            }
            if (this.tableDatadialog[i].createTime !== undefined) {
              var date = new Date(this.tableDatadialog[i].createTime);
              this.tableDatadialog[i].createTime = formatDate(date, 'yyyy-MM-dd hh:mm')
            } else {
              this.tableDatadialog[i].createTime = '';
            }
            if (this.tableDatadialog[i].outTime !== undefined) {
              var date = new Date(this.tableDatadialog[i].outTime);
              this.tableDatadialog[i].outTime = formatDate(date, 'yyyy-MM-dd hh:mm')
            } else {
              this.tableDatadialog[i].outTime = '';
            }
          }
        }
        this.Gloadingdialog = false;
      })
    },
    getsearchTxt() {
      var loginParams = {
        name: this.searchTxt,
        pgPageNum: 0
      };
      getvisit(loginParams).then(data => {
        if (data.resList !== undefined) {
          this.Page = data;
          for (var i = 0; i < this.Page.resList.length; i++) {
            if (this.Page.resList[i].liveFlag === 0) {
              this.Page.resList[i].liveName = '点播';
            } else {
              this.Page.resList[i].liveName = '直播';
            }
          }
          this.Gloading = false;
        } else {
          this.Page = {};
        }
      })
    },
    getsearchTxtdialog() {
      var loginParams = {
        course: this.choesecourse,
        username: this.searchTxtdialog,
        pgPageNum: 1
      };
      getvisituser(loginParams).then(data => {
        this.tableDatadialog = [];
        // console.log(data);
        if (data.resList !== undefined) {
          this.tableDatadialog = data.resList;
          this.Pagedialog = data;
          for (var i = 0; i < this.tableDatadialog.length; i++) {
            if (this.tableDatadialog[i].username === undefined && this.tableDatadialog[i].nickName === undefined) {
              this.tableDatadialog[i].tof = true;
            } else {
              this.tableDatadialog[i].tof = false;
            }
            if (this.tableDatadialog[i].createTime !== undefined) {
              var date = new Date(this.tableDatadialog[i].createTime);
              this.tableDatadialog[i].createTime = formatDate(date, 'yyyy-MM-dd hh:mm')
            } else {
              this.tableDatadialog[i].createTime = '';
            }
            if (this.tableDatadialog[i].outTime !== undefined) {
              var date = new Date(this.tableDatadialog[i].outTime);
              this.tableDatadialog[i].outTime = formatDate(date, 'yyyy-MM-dd hh:mm')
            } else {
              this.tableDatadialog[i].outTime = '';
            }
          }
        }
        this.Gloadingdialog = false;
      })
    },
    show(ev) {
      if (ev.keyCode === 13) {
        if (this.dialogVisible) {
          this.getsearchTxtdialog();
        } else {
          this.getsearchTxt();
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
