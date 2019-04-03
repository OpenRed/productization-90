<template>
  <div style="width:100%;height:100%;">
    <div>
      <div class="TopName W95">
        <i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="GOBack"></i>查看考试详情</div>
    </div>
    <div class="TopLine"></div>
    <div class="TopButtonT W95">
      <div class="TopButtonRight2">
        <input class="TopButtonRightInput" v-model="searchTxt" v-on:input ="" @keydown="" type="text" placeholder="考试人员"/>
        <label class="el-icon-search TopButtonRightSearch" @click=""></label>
        <el-button type="default" style="padding: 5px 10px;" @click="">搜索</el-button>
      </div>
    </div>
    <div id="TableDiv" class="W95 Teacher_List_Table" >
      <div style="width: 100%;height:calc(100% - 20px);overflow-y: auto;border:1px solid #cdcdcd;">
        <div style="width:100%;height:40px;line-height:40px;text-align: center">
          <div class="table_header" style="float:left;width:12%;height:100%;border-bottom:1px solid #cdcdcd;">参与人员</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:calc(28% - 6px);height:100%;border-bottom:1px solid #cdcdcd;">考试名称</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:8%;height:100%;border-bottom:1px solid #cdcdcd;">分数</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:8%;height:100%;border-bottom:1px solid #cdcdcd;">是否及格</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:18%;height:100%;border-bottom:1px solid #cdcdcd;">开始考试时间</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:18%;height:100%;border-bottom:1px solid #cdcdcd;">交卷时间</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:8%;height:100%;border-bottom:1px solid #cdcdcd;">补考次数</div>
          <span v-for="item in ExamList">
            <div style="float:left;width:12%;height:100%;border-bottom:1px solid #cdcdcd;">{{username}}</div>
            <div class='ListBorder'></div>
            <div class="Over" style="float:left;width:calc(28% - 6px);height:100%;border-bottom:1px solid #cdcdcd;">{{item.name}}</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:8%;height:100%;border-bottom:1px solid #cdcdcd;">{{item.score}}</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:8%;height:100%;border-bottom:1px solid #cdcdcd;">
              <span v-if="item.pass==1">及格</span>
              <span v-else>不及格</span>
            </div>
            <div class='ListBorder'></div>
            <div style="float:left;width:18%;height:100%;border-bottom:1px solid #cdcdcd;">2018</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:18%;height:100%;border-bottom:1px solid #cdcdcd;">{{item.createTimeTrans}}</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:8%;height:100%;border-bottom:1px solid #cdcdcd;"><span class="span409EFF" @click="VisitRework">{{item.rework}}</span></div>
          </span>
        </div>
      </div>
    </div>

    <el-pagination
      style="margin-right:20px;float:right"
      :page-size="Page.pgLimit"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, jumper"
      :total="Page.pgTotalCount">
    </el-pagination>

    <!--查看补考次数-->
    <el-dialog :visible.sync="dialogVisible" :title="titlename" top="5%" :before-close="closeDialog">
      <div style="height:400px;">
        <table border="1" bordercolor="#cdcdcd" style="width: 100%;text-align:center;border-collapse:collapse;">
          <tr style="background: #20a0ff">
            <th style="width: 20%">姓名</th>
            <th style="width: 20%">补考分数</th>
            <th style="width: 20%">是否及格</th>
            <th style="width: 20%">开始补考时间</th>
            <th style="width: 20%">补考交卷时间</th>
          </tr>
          <tr v-for="">
            <td>test</td>
            <td>90</td>
            <td>及格</td>
            <td>2018-6-10</td>
            <td>10:30</td>
          </tr>
        </table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getUserStatistic } from '@/api/api';
  import { Timetrans } from '@/util/util';

  export default {
    data() {
      return {
        uid: window.localStorage.getItem('sassuid'),
        username: window.localStorage.getItem('sassusername'),
        Page:'',
        searchTxt: '',
        dialogVisible: false,
        titlename: '查看补考次数',
        ExamList: []
      }
    },
    beforeCreate:function(){
      if(window.localStorage.getItem('saasLoginTrueOrFalse')==='false' || window.localStorage.getItem('saasLoginTrueOrFalse')===null){
        this.$router.push('/Login');
      }else{

        }
    },
    mounted(){
      getUserStatistic({uid:this.uid}).then(data=>{
        if(data.resCode==0){
          this.ExamList = data.resList;
          this.ExamList.forEach(item=>{
            if(item.createTime) item['createTimeTrans'] = Timetrans(item.createTime);
          });
          this.Gloading = false;
        }
        else this.openError(data.resMsg);
      });
    },
    methods:{
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
      GOBack(){
        this.$router.push('Exam_Statistic');
      },
      closeDialog(){ this.dialogVisible = false; },
      VisitRework(){
        this.dialogVisible = true;
      },
      handleCurrentChange(){}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
