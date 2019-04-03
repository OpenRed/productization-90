<template>
  <div style="width:100%;height:100%;">
    <div class="TopName W95"><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="goBack"></i>{{title}}</div>
    <div class="TopLine"></div>
    <div class="TopContent" style="height: 100%;">
      <el-form :model="form" label-width="100px" style="margin-top:15px;overflow-y:auto" id="form" method="post" >
        <el-form-item label="标签名称">
          <el-input v-model="form.name" style="width: 385px;" placeholder="请输入标签名称" id="name" autofocus ></el-input>
        </el-form-item>
        <el-form-item label="标签描述">
          <el-input v-model="form.desc" style="width: 385px;" placeholder="请输入标签描述" autofocus ></el-input>
        </el-form-item>

        <el-form-item label="" >
          <el-button type="primary"style="width:120px" @click="OnaddTag()" >提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { getTag,addTag,updTag } from '@/api/api';
  import NotContent from '@/components/public/NotContent';

  export default {
    data() {
      return {
        title:window.localStorage.getItem('saastag'),
        form: {
          id: '',
          name: '',
          type: 1,
          desc: ''
        },
        titlename:'选择部门',
        hackReset: false,
        TagList: [],
        tofIE9:navigator.appName == "Microsoft Internet Explorer"&&parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<=9
      }
    },
    components:{ NotContent },
    beforeCreate:function(){
      if(window.localStorage.getItem('saasLoginTrueOrFalse')==='false' || window.localStorage.getItem('saasLoginTrueOrFalse')===null){
        this.$router.push('/Login');
      }
    },
    mounted(){
      this.hack();
      if(this.title==='编辑标签'){
        let id = window.localStorage.getItem('saastagid');
        this.form.id = id;
        getTag({id:id}).then(data=>{
          if(data){
            if(data.name) this.form.name = data.name;
            if(data.desc) this.form.desc = data.desc;
          }
        });
      }
      setTimeout(function() {
        document.querySelector('#name input').focus();
      }, 20)
    },
    computed:{

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
      goBack() {
        this.$router.push('/TagList');
      },
      hack(){
        this.hackReset = false; // hack方法强制刷新组件
        this.$nextTick(() => {
          this.hackReset = true;
        })
      },
      OnaddTag(){
        // console.log(this.form);
        if(!this.form.name){ return this.openError('标签名称不能为空！');}
        if(this.title==='添加标签'&&this.form.name.trim().length!=0&&this.form.name){
          addTag(this.form).then(data=>{
            // console.log(data);
            if(data.success){
              this.openSuccess(data.resMsg);
              this.$router.push('/TagList');
            }else{
              this.openError(data.resMsg);
            }
          });
        }

        if(this.title==='编辑标签'&&!(/\s/.test(this.form.name))&&this.form.name.trim().length!=0&&this.form.name){
          updTag(this.form).then(data=>{
            // console.log(data);
            if(data.success){
              this.openSuccess(data.resMsg);
              this.$router.push('/TagList');
            }else{
              this.openError(data.resMsg);
            }
          });
        }
      }
    }
  }
</script>
