<template>
<div style="width:100%;height:100%;">
  <div class="TopButton W95">
    <span class="TopButtonLeft">
      <el-button type="primary" style="float:left" @click="AddCarousel">创建轮播图</el-button>
    </span>
    <div class="TopButtonRight">
      <div style="margin:0 10px;float:left;font-size:12px;">轮播图将在手机客户端的首页顶端滚动展示.</div>
    </div>
  </div>
  <div id="TableDiv" class="W95 Teacher_List_Table" style="overflow:hidden;" v-loading="Gloading" element-loading-text="加载中。。。" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <div v-for="data in tableData" style="width:200px;height:190px;border:1px solid #cdcdcd;margin:10px 15px 10px 0;float:left;overflow:hidden;">
      <div style="width:378px;height:100px;position:relative;left:-50%;" @click="gochange(data)">
        <img :src="data.cover" :onerror="errorImg" width="100%" height="100%" alt="">
      </div>
      <!-- <img :src="data.cover" style="width:378px;height:100px;position:relative;left:-50%;" @click="gochange(data)" /> -->
      <div style="font-size:12px;padding-left:10px;margin-top:10px" class="Over" :title="data.name">{{ThemeName}}标题：{{data.name}} {{data.index}}</div>
      <div style="display:none;">{{qwe}}</div>
      <div style="font-size:12px;padding-left:10px;margin-top:10px">创建时间：{{data.createTime}}</div>
      <div style="font-size:12px;padding-left:10px;height:30px;float:left;line-height:30px;">
        <el-button type="text" @click="Ondelbanner(data.id)">删除</el-button>
        <span style="margin-left:75px">上架 <el-switch v-model="data.tofDis" on-text="" off-text="" @change="changedis(data.id)"></el-switch></span>
      </div>
    </div>
    <not-content v-if="NotDis"></not-content>
  </div>
</div>
</template>

<script>
import {
  getbanner,
  changebanner,
  delbanner,
  getOnecourses,
  updcourse
} from '@/api/api';
import NotContent from '@/components/public/NotContent';

import {
  formatDate
} from '@/util/util';
export default {
  data() {
    return {
      Gloading: true,
      tableData: [],
      qwe: 0,
      NotDis: false,
      errorImg: 'this.src="' + require('@/static/img/picture.jpg') + '"',
      ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : ''
    }
  },
  components: {
    NotContent
  },
  beforeCreate: function() {
    // Connection();
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    } else {
      getbanner().then(data => {
        var that = this;
        if (data.resList !== undefined) {
          this.NotDis = false;
          that.tableData = data.resList;
          for (var j = 0; j < that.tableData.length; j++) {
            getOnecourses(that.tableData[j].val).then(data => {
              if (data.success) {
                for (var i = 0; i < that.tableData.length; i++) {
                  if (parseInt(that.tableData[i].val) === data.id) {
                    that.tableData[i].name = data.name;
                  }
                }
                that.qwe++;
              }
            })
          }
          for (var i = 0; i < that.tableData.length; i++) {
            var d = new Date(that.tableData[i].createTime);
            if (that.tableData[i].status === 0) {
              that.tableData[i].tofDis = true;
            } else {
              that.tableData[i].tofDis = false;
            }
            that.tableData[i].createTime = formatDate(d, 'yyyy-MM-dd hh:mm');

            // add
            that.tableData.index = i;
          }
        } else {
          this.NotDis = true;
        }
        that.Gloading = false;
      });
    }
  },
  methods: {
    openError(text) {
      this.$message({
        showClose: true,
        message: text,
        type: 'error'
      });
    },
    AddCarousel: function() {
      this.$router.push('/AddCarousel');
    },
    changedis(id) {
      var status = 0;
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === id) {
          if (this.tableData[i].status === 0) {
            status = 1;
          }
        }
      }
      var loginParams = {
        id: id,
        status: status,
        model: '',
        val: '',
        sort: '',
        cover: ''
      };
      changebanner(loginParams).then(data => {
        if (data.success) {
          getbanner().then(data => {
            var that = this;
            if (data.resList !== undefined) {
              this.NotDis = false;
              that.tableData = data.resList;
              for (var j = 0; j < that.tableData.length; j++) {
                getOnecourses(that.tableData[j].val).then(data => {
                  if (data.success) {
                    for (var i = 0; i < that.tableData.length; i++) {
                      if (parseInt(that.tableData[i].val) === data.id) {
                        that.tableData[i].name = data.name;
                      }
                    }
                    that.qwe++;
                  }
                })
              }
              for (var i = 0; i < that.tableData.length; i++) {
                var d = new Date(that.tableData[i].createTime);
                if (that.tableData[i].status === 0) {
                  that.tableData[i].tofDis = true;
                } else {
                  that.tableData[i].tofDis = false;
                }
                that.tableData[i].createTime = formatDate(d, 'yyyy-MM-dd hh:mm');
              }
            } else {
              this.NotDis = true;
            }

          });
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    Ondelbanner(id) {
      this.$confirm('确定删除该轮播图?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        delbanner(id).then(data => {
          var that = this;
          if (data.success) {
            if (that.tableData.length === 1) {
              this.NotDis = true;
            }
            for (var i in that.tableData) {
              if (that.tableData[i].id === id) {
                that.tableData.splice(i, 1);
              }
            }
          } else {
            data.resMsg;
          }
        })
      }).catch(() => {});
    },
    gochange(data) {
      window.localStorage.setItem('saasbannerid', data.id);
      window.localStorage.setItem('saasbannerval', data.val);
      window.localStorage.saascover = data.cover;
      this.$router.push('/UpdCarousel');
    }

  },
}
</script>
