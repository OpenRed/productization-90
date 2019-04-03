<template>
<div class="BottomDiv">
  <el-col :span="4" class="Left">
    <img id="myicon" v-if="myicon!==undefined || myicon===''" :src="myicon" onerror="this.onerror=null;this.src='./../../static/img/avatar.jpg'" />
    <img id="myicon" v-else src="./../../static/img/avatar.jpg" />
    <div style="height:20px"></div>
    <div>
      <el-button type="text" class="Leftdiv" @click="GoMyData">个人资料</el-button>
    </div>
    <div>
      <el-button type="text" class="Leftdiv" @click="GoUpdPwd">修改密码</el-button>
    </div>
  </el-col>
  <el-col :span="20" class="Right">
    <router-view></router-view>
  </el-col>
</div>
</template>

<script>
export default {
  data() {
    return {
      myicon: window.localStorage.saasuser ? JSON.parse(window.localStorage.saasuser).logoUrl : ''
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  methods: {
    GoMyData: function() {
      this.$router.push('/UpdMsg');
    },
    GoUpdPwd: function() {
      this.$router.push('/UpdPwd');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
