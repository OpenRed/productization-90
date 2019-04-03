<template>
  <div style="width:100%;height:100%;">
    <div>
      <div class="TopName W95"><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="GOBack"></i>查看考试结果</div>
    </div>
    <div class="TopLine"></div>
    <div class="TopButtonT W95">
      <div class="TopButtonRight2">
        <input class="TopButtonRightInput" v-model="searchTxt" v-on:input ="" @keydown="" type="text" placeholder="考试名称"/>
        <label class="el-icon-search TopButtonRightSearch" @click=""></label>
        <el-button type="default" style="padding: 5px 10px;" @click="">搜索</el-button>
      </div>
    </div>
    <div id="TableDiv" class="W95 Teacher_List_Table" >
      <div style="width: 100%;height:calc(100% - 20px);overflow-y: auto;border:1px solid #cdcdcd;"
      element-loading-text="加载中。。。"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
        <div style="width:100%;height:40px;line-height:40px;text-align: center">
          <div class="table_header" style="float:left;width:10%;height:100%;border-bottom:1px solid #cdcdcd;">参与人员</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:10%;height:100%;border-bottom:1px solid #cdcdcd;">手机号</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:calc(26% - 7px);height:100%;border-bottom:1px solid #cdcdcd;">试卷名称</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:8%;height:100%;border-bottom:1px solid #cdcdcd;">分数</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:8%;height:100%;border-bottom:1px solid #cdcdcd;">是否及格</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">考试开始时间</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">交卷时间</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:8%;height:100%;border-bottom:1px solid #cdcdcd;">补考次数</div>

          <span v-for="item in examList">
            <div style="float:left;width:10%;height:100%;border-bottom:1px solid #cdcdcd;">{{item.userName}}</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:10%;height:100%;border-bottom:1px solid #cdcdcd;">{{item.userMobile}}</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:calc(26% - 7px);height:100%;border-bottom:1px solid #cdcdcd;" class="Over">{{item.name}}</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:8%;height:100%;border-bottom:1px solid #cdcdcd;">{{item.score}}</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:8%;height:100%;border-bottom:1px solid #cdcdcd;">
              <span v-if="item.pass==1">是</span>
              <span v-else>否</span>
            </div>
            <div class='ListBorder'></div>
            <div style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">2018-01-01 00:00</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">{{item.handintime}}</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:8%;height:100%;border-bottom:1px solid #cdcdcd;">{{item.rework}}</div>
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
  </div>
</template>

<script>
import { getExamResult } from '@/api/api';
import { formatDate,Timetrans } from '@/util/util';

export default {
  data() {
      return {
        searchTxt:'',
        Page: [],
        sassreports: window.localStorage.getItem('sassreports'),
        examList: []
      }
    },
    beforeCreate:function(){
      if(window.localStorage.getItem('saasLoginTrueOrFalse')==='false' || window.localStorage.getItem('saasLoginTrueOrFalse')===null){
        this.$router.push('/Login');
      }else{

      }
    },
    mounted(){
      if(this.sassreports!='null'){
        getExamResult(JSON.parse(this.sassreports)).then(data=>{
          if(data.resCode==0){
            if(data.resList && data.resList!=''){
              this.examList = data.resList;
              this.examList.forEach(item=>{
                if(item.createTime) item.handintime = Timetrans(item.createTime);
              });
            }
          }
          else this.openError(data.resMsg);
        });
      }
    },
    beforeDestroy(){
      window.localStorage.setItem('sassreports', null);
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
      GOBack(){ this.$router.push('/Chapter'); },
      Exam_Person(){},
      handleCurrentChange(){}
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
