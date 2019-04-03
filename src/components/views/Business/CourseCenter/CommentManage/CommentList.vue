<template>
<div style="width:100%;height:100%;">
  <div>
    <div class="TopName W95">评论审核</div>
  </div>
  <div class="TopLine"></div>
  <div class="TopButtonT W95">
    <!-- <span class="TopButtonLeft">
        <el-button type="primary" @click="AddComment" style="width:100px">添加评论</el-button>
      </span> -->
    <div class="TopButtonRight4" style="margin-left:0">
      <input class="TopButtonRightInput" type="text" v-model="searchTxt" placeholder="请输入关键字" v-on:input="searchCourseInput">
      <el-button type="default" style="padding: 5px 10px;" @click="searchCourseBtn">搜索</el-button>
    </div>
  </div>
  <div id="TableDiv" class="W95 CommentList_List_Table">
    <el-table :data="CourseData.resList" border height="100%" style="width: 100%;height:100%;">
      <el-table-column prop="name" :label="ThemeName+'名称'">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="ViewComment(scope.row)">查看评论</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-pagination style="margin:20px 20px 0 0;float:right;" :page-size="CourseData.pgLimit" @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :total="CourseData.pgTotalCount">
  </el-pagination>

  <!--查看评论-->
  <el-dialog :visible.sync="dialogVisible" :title="titlename" top="5%" @close="closeDialog">
    <div style="width: 100%;height: 468px;overflow-x: hidden;border: 1px solid #cdcdcd;" v-if="hackReset">
      <table border="1" bordercolor="#cdcdcd" style="width: 100%;text-align:center;border-collapse:collapse;">
        <tr style="background: rgb(220, 220, 220)">
          <th style="width: 20%">直播{{ThemeName}}</th>
          <th style="width: 10%">评论用户</th>
          <th style="width: 20%">评论内容</th>
          <th style="width: 15%">评论时间</th>
          <th style="width: 10%">当前状态</th>
          <th style="width: 25%">操作</th>
        </tr>
        <tr v-for="item in CommentList" v-if="CommentList.length !== 0 && hackReset">
          <td>{{coursename}}</td>
          <td>{{item.userName}}</td>
          <td>{{item.content}}</td>
          <td>{{item.createTimeTrans}}</td>
          <td>
            <span v-if="item.status === 0">审核通过</span>
            <span v-if="item.status === 1">未审核</span>
            <span v-if="item.status === 2">审核驳回</span>
          </td>
          <td>
            <el-button type="text" @click="VerifyComment(item)" v-if="item.status==1 || item.status==2">审核通过</el-button>
            <el-button type="text" @click="RejectComment(item)" v-if="item.status==1 || item.status==0">审核驳回</el-button>
            <el-button type="text" @click="DelComment(item)">删除</el-button>
          </td>
        </tr>
        <tr v-if="CommentList.length === 0">
          <td colspan="6">暂无评论</td>
        </tr>
      </table>
    </div>

    <div style="height:1px; margin: 10px auto;clear: both">
      <el-button style="float:right" type="primary" size="small" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  getcourse,
  getCommentList,
  verifyComment,
  rejectComment,
  delComment
} from '@/api/api';
import NotContent from '@/components/public/NotContent';
import {
  formatDate,
  Timetrans
} from '@/util/util';

export default {
  data() {
    return {
      NotDis: false,
      tableData: [],
      searchTxt: '',
      dialogVisible: false,
      hackReset: false,
      titlename: '查看直播评论',
      CourseData: [],
      CommentList: [],
      coursename: '',
      ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : ''
    }
  },
  components: {
    NotContent
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    } else {

    }
  },
  mounted() {
    this.hack()
    this.getCourse({
      name: this.searchTxt,
      pgPageNum: 1
    })
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
      // console.log('hack it!');
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
      })
    },
    getCourse(params) {
      getcourse(params).then(data => {
        if (data.success) {
          if (data.resList) {
            this.NotDis = false;
            this.CourseData = data;
          } else {
            this.NotDis = true;
            this.CourseData = [];
          }
        } else {
          this.openError(data.resMsg);
          this.CourseData = [];
        }
      })
    },
    closeDialog() {
      this.dialogVisible = false
    },
    getComment(params) {
      getCommentList(params).then(data => {
        // console.log(data);
        if (data.success && data.resList) {
          this.CommentList = data;
        } else {
          this.CommentList = [];
        }
      });
    },
    ViewComment(item) {
      this.coursename = item.name
      getCommentList(item.id).then(res => {
        if (res.resCode === 0) {
          this.CommentList = res.resList || []
          this.CommentList.forEach(item => {
            item.createTimeTrans = Timetrans(item.createTime)
          })
          this.dialogVisible = true
          this.hack()
        } else {
          this.openError(res.resMsg)
        }
      })
    },
    VerifyComment(item) {
      verifyComment(item.id).then(res => {
        if (res.resCode === 0) {
          this.CommentList.forEach(item2 => {
            if (item2.id === item.id) item2.status = 0
          })
          this.openSuccess('评论审核通过')
        } else {
          this.openError(res.resMsg)
        }
      })
    },
    RejectComment(item) {
      rejectComment(item.id).then(res => {
        if (res.resCode === 0) {
          this.CommentList.forEach(item2 => {
            if (item2.id === item.id) item2.status = 2
          })
          this.openSuccess('评论审核已驳回！')
        } else {
          this.openError(res.resMsg)
        }
      })
    },
    DelComment(item) {
      this.$confirm('确认删除该评论?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        delComment(item.id).then(data => {
          if (data.success) {
            this.openSuccess('评论已删除！');

            if (this.CommentList.length == 1) {
              this.NotDis = true;
            }
            for (var i in this.CommentList) {
              if (this.CommentList[i].id == item.id) {
                this.CommentList.splice(i, 1);
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        });
      }).catch(() => {});
    },
    searchCourseInput() {
      let params = {
        pgPageNum: 1
      }
      if (this.searchTxt !== '') params['name'] = this.searchTxt;
      this.getCourse(params);
    },
    searchCourseBtn() {
      if (this.searchTxt !== '') {
        this.getCourse({
          name: this.searchTxt,
          pgPageNum: 1
        });
      } else {
        this.openError('请先输入关键字再进行搜索');
      }
    },
    handleCurrentChange(currentPage) {
      var loginParams = {
        name: this.searchTxt,
        pgPageNum: currentPage
      };
      getcourse(loginParams).then(data => {
        if (data.resCode === 0) {
          this.CourseData = data
        } else {
          this.openError(data.resMsg)
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
