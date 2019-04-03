<template>
<div style="width:100%;height:100%;">
  <div class="w95" style="border:1px solid #cdcdcd;height:60px;line-height:60px;background:#dedede">
    <el-button type="primary" size="large" style="margin:10px;float:left" @click="AddAdvert">创建广告图</el-button>
    <div style="font-size:12px;height:20px;">广告图将在手机客户端的启动页展示.</div>
    <!-- <div style="font-size:12px">2、拖动图片可进行排序。</div> -->
  </div>
  <div style="width:100%;height:calc(100% - 120px);overflow-y: auto;" v-loading="Gloading" element-loading-text="加载中。。。" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <div v-for="data in tableData" style="width:200px;height:460px;border:1px solid #cdcdcd;margin:10px;float:left;overflow:hidden;" v-if="hackReset">
      <img :src="data.cover" style="width:200px;height:355px;" @click="gochange(data)" />
      <div style="font-size:12px;padding-left:10px" class="Over" :title="data.name">广告名称：{{data.title}}</div>
      <div style="font-size:12px;padding-left:10px;margin-top:10px">
        广告位置：
        <span v-if="data.postion === 1">首页</span>
        <span v-if="data.postion === 6">预约列表</span>
        <span v-if="data.postion === 9">启动页</span>
      </div>
      <div style="font-size:12px;padding-left:10px;margin-top:10px">创建时间：{{data.createTimeTrans}}</div>
      <div style="font-size:12px;padding-left:10px;height:30px;float:left;line-height:30px;">
        <el-button type="text" @click="OndelAdvert(data.id)">删除</el-button>
        <span style="margin-left:80px">
          上架
          <el-switch v-model="data.tofDis" on-text="" off-text="" @change="changedis(data)"></el-switch>
        </span>
      </div>
    </div>
    <not-content v-if="NotDis"></not-content>
  </div>

</div>
</template>

<script>
import {
  getAdvertList,
  updAdvert,
  delAdvert
} from '@/api/api';
import NotContent from '../../Modules/NotContent';

import {
  formatDate,
  Timetrans
} from '@/util/util';
export default {
  data() {
    return {
      Gloading: true,
      tableData: [],
      NotDis: false,
      hackReset: false
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
      getAdvertList().then(data => {
        // console.log(data);
        if (data.resList !== undefined) {
          this.tableData = data.resList;
          this.tableData.forEach(item => {
            item['createTimeTrans'] = formatDate(new Date(item.createTime), 'yyyy-MM-dd hh:mm');
            if (item.status === 0) item.tofDis = true;
            else item.tofDis = false;
          })
        } else {
          this.NotDis = true;
        }
        this.Gloading = false;
      });
    }
  },
  mounted() {
    this.hack();
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
    AddAdvert: function() {
      this.$router.push('/AddAdvert');
    },
    changedis(data) {
      let flag = 1,
        dataid = data.id;
      if (data.tofDis) flag = 0;
      else flag = 1;
      let loginParams = {
        id: dataid,
        status: flag
      }
      updAdvert(loginParams).then(data => {
        // console.log(data);
        if (data.resCode === 0) {
          this.tableData.forEach(item => {
            if (item.id === dataid) {
              console.log(flag === 0 ? true : false);
              item.tofDis = flag === 0 ? true : false;
              if (flag === 0) this.openSuccess('上架成功！')
              else this.openSuccess('下架成功！')
            }
            this.hack();
          })
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    OndelAdvert(id) {
      this.$confirm('确定删除该广告图?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        delAdvert({
          id: id
        }).then(data => {
          // console.log(data);
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
      window.localStorage.setItem('saasadvert', JSON.stringify(data));
      this.$router.push('/UpdAdvert');
    }
  }
}
</script>
