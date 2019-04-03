<template>
  <div class="MyData_Div">
    <div class="TopName W95">个人资料</div>
    <div class="TopLine"></div>
    <div class="W95">
      <el-button type="text" id="Msg" @click="GoUpdMsg">基本信息</el-button>
      <el-button type="text" id="Icon" @click="GoUpdIcon">头像编辑</el-button>
    </div>
    <div class="TopLine"></div>
    <div class="MyData_Content">
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  beforeCreate:function(){
    if(window.localStorage.getItem('saasLoginTrueOrFalse')==='false' || window.localStorage.getItem('saasLoginTrueOrFalse')===null){
      this.$router.push('/Login');
    }
  },
  methods:{
    GoUpdMsg: function(){
      this.$router.push('/UpdMsg');
    },
    GoUpdIcon: function(){
      this.$router.push('/UpdIcon');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
