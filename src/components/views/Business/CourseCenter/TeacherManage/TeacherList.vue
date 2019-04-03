<template>
<div style="width:100%;height:100%;">
  <div>
    <div class="TopName W95">讲师管理</div>
  </div>
  <div class="TopLine"></div>
  <div class="TopButton W95">
    <span class="TopButtonLeft">
      <el-button type="primary" @click="addteacher">添加讲师</el-button>
    </span>
    <div class="TopButtonRight">
    </div>
  </div>
  <div id="TableDiv" class="W95 Teacher_List_Table" style="overflow-y: auto;">
    <div class="Teacher_list_div" v-for="data in tableData">
      <div style="width:100%;height:60px;cursor: pointer;" :title="data.name" @click="updteacher(data)">
        <div style="width:60px;height:60px;float:left;margin-right:20px;object-fit:cover;">
          <img :src="data.cover" :onerror="errorImg" width="100%" height="100%" alt="">
        </div>
        <div style="width:150px;height:30px;line-height:30px;float:left;font-size:16px;color:#333333;" class="Over">{{data.name}}</div>
        <div style="width:150px;height:30px;line-height:30px;float:left;color:#333333;">{{data.mobile}}</div>
      </div>
      <div style="width:100%;height:40px;padding-left:10px;margin-top:10px;">
        <div style="width:50%;height:40px;float:left;line-height:40px;">{{ThemeName}}：{{data.courseCount}}</div>
        <div style="width:50%;height:40px;float:left;line-height:40px;">
          <el-button type="text" @click="GoAddCourse(data)">添加{{ThemeName}}</el-button>
          <el-button type="text" @click="Ondellecturer(data.id,data.uid)">删除</el-button>
        </div>
      </div>
    </div>
    <not-content v-if="NotDis"></not-content>
  </div>
</div>
</template>

<script>
import {
  getlecturer,
  dellecturer
} from '@/api/api';
import NotContent from '@/components/public/NotContent';
export default {
  data() {
    return {
      NotDis: false,
      tableData: [],
      errorImg: 'this.src="' + require('@/static/img/avatar.jpg') + '"',
      ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : ''
    }
  },
  components: {
    NotContent
  },
  beforeCreate() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    } else {
      getlecturer().then(data => {
        // console.log(data);
        this.tableData = data.resList;
        this.NotDis = this.tableData !== undefined ? false : true;
      });
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
    addteacher: function() {
      window.localStorage.saastitle = '添加讲师';
      this.$router.push('/AddTeacher');
    },
    updteacher(data) {
      var Lecturer = JSON.stringify(data);
      window.localStorage.setItem('saasdata', Lecturer);
      window.localStorage.saastitle = '编辑讲师';
      this.$router.push('/AddTeacher');
    },
    GoAddCourse: function(data) {
      window.localStorage.setItem('saasteacherid', data.id);
      window.localStorage.setItem('saasteachername', data.name);
      this.$router.push('/AddCourse');
    },
    Ondellecturer(id, uid) {
      this.$confirm('确定删除该讲师?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        var loginParams = {
          id: id,
          uid: uid
        };
        dellecturer(loginParams).then(data => {
          if (data.success) {
            if (this.tableData.length === 1) {
              this.NotDis = true;
            }
            for (var i in this.tableData) {
              if (this.tableData[i].id === id) {
                this.tableData.splice(i, 1);
              }
            }
            this.openSuccess('讲师已删除！')
          } else {
            this.openError(data.resMsg);
          }
        })
      }).catch(() => {});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Teacher_list_div {
  border-radius: 4px;
  width: 240px;
  /*height:130px;*/
  border: 1px solid #cdcdcd;
  float: left;
  margin-right: 20px;
  margin-top: 10px;
  padding: 10px;

}
</style>
