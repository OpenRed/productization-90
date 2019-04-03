<template>
  <div class="MyData_Div">
    <div >
      <div class="TopName W95">首页管理</div>
    </div>
    <div class="TopLine"></div>
    <div >
      <div class="W95">
        <el-button type="text" id="Msg" @click="GoUpdMsg">版块设置</el-button>
        <el-button type="text" id="Icon" @click="GoUpdIcon">首页轮播</el-button>
      </div>
    </div>
    <div class="TopLine"></div>
    <div class="FirstP_Content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  beforeCreate:function(){
    if(window.localStorage.getItem('saasLoginTrueOrFalse')==='false' || window.localStorage.getItem('saasLoginTrueOrFalse')===null){
      this.$router.push('/Login');
    }
    var path = this.$route.path.replace('/','');
    if(path === 'Plate'){
      this.ChoeseTof = true;
    }else{
      this.ChoeseTof = false;
    }
  },
  methods:{
    GoUpdMsg: function(){
      this.ChoeseTof = true;
      this.$router.push('/Plate');
    },
    GoUpdIcon: function(){
      this.ChoeseTof = false;
      this.$router.push('/Carousel');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
