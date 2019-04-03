<template>
<div class="BAll">
  <div class="TopDiv">
    <img class="TopSName" :src="orgLogo" />

    <el-dropdown trigger="hover" class="TopUName">
      <span class="el-dropdown-link userinfo-inner">
        <div class="TopImageS">
          <img class="TopImage" v-if="myicon!==undefined || myicon===''" :src="myicon" onerror="this.onerror=null;this.src='./../static/img/avatar.jpg'" />
          <img class="TopImage" v-else src="./../static/img/avatar.jpg" />
        </div>
        <span>{{name}}</span>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="mydata">个人资料</el-dropdown-item>
        <el-dropdown-item @click.native="updpwd">修改密码</el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
      <div style="display:none">{{qwe}}</div>
    </el-dropdown>

    <!-- 机构下拉列表 -->
    <div style="float:right;text-align:right;margin-top:20px;">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link" style="color:#EFEFEF">
          <!-- 隐藏机构 -->
          {{choeseOrg}}<i class="el-icon-caret-bottom" style="margin-left:20px"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="oL in onOrgs" :key="oL.index" :command='oL' style="width:300px;height:35px;line-height:35px;margin: 5px 0;">
            <img :src="oL.logoUrl" style="float:left;width:53px;height:35px;object-fit:scale-down;" />
            <div style="float:left;line-height:35px;margin-left:5px;width:242px;" class="Over" :title="oL.name"><span>{{oL.name}}</span></div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>

  <div class="MiddleDiv" style="border-top: 1px solid #D1DBE5;">
    <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect" :default-active="onRoutes" router style="padding-left:20px;background:#FFFFFF">
      <template v-for="item in Navs">
        <el-menu-item :index="item.path" :key="item.path" style="line-height:40px;height:40px" :class="{'active-item':item.path === router}">
          <i :class="item.icon"></i>{{item.title}}
        </el-menu-item>
      </template>
    </el-menu>
  </div>

  <div class="Basis_RView">
    <router-view></router-view>
  </div>

</div>
</template>

<script>
import {
  requestloginOut,
  getorganization
} from '../api/api';
import router from '../router';

export default {
  data() {
    return {
      myicon: window.localStorage.saasuser ? JSON.parse(window.localStorage.saasuser).logoUrl : '',
      name: window.localStorage.saasuser ? JSON.parse(window.localStorage.saasuser).name : '',
      items: [
        // {
        //     icon: 'el-icon-menu',
        //     index: 'Home',
        //     title: '首页'
        // },
        {
          icon: 'el-icon-picture',
          index: 'Business',
          title: '业务中心',
          menu: [{
              index: '1',
              title: '课程中心',
              subs: [{
                  bgcolor: '#409EFF',
                  index: 'FirstP_List',
                  title: '首页管理'
                },
                {
                  bgcolor: '#409EFF',
                  index: 'Resource_List',
                  title: '课程管理'
                },
                {
                  bgcolor: '#409EFF',
                  index: 'CourseSort',
                  title: '课程分类'
                },
                {
                  bgcolor: '#409EFF',
                  index: 'Teacher_List',
                  title: '讲师管理'
                }
              ]
            },
            {
              index: '2',
              title: '资源管理',
              subs: [{
                index: 'File_List',
                title: '资源列表'
              }]
            },
            {
              index: '3',
              title: '通讯录',
              subs: [{
                  index: 'Department_List',
                  title: '部门管理'
                },
                {
                  index: 'Tag_List',
                  title: '标签管理'
                },
                {
                  index: 'Personnel_List',
                  title: '人员管理'
                }
              ]
            }
            // {
            //   index: '2',
            //   title: '考试中心',
            //   subs: [{
            //       bgcolor: '#409EFF',
            //       index: 'Exam_List',
            //       title: '考试管理'
            //     },
            //     {
            //       bgcolor: '#409EFF',
            //       index: 'Paper_List',
            //       title: '试卷管理'
            //     },
            //     {
            //       bgcolor: '#409EFF',
            //       index: 'Test_List',
            //       title: '题库管理'
            //     },
            //     {
            //       bgcolor: '#409EFF',
            //       index: 'Topic_List',
            //       title: '题目管理'
            //     }
            //   ]
            // },
            // {
            //   index: '3',
            //   title: '统计中心',
            //   subs: [{
            //       bgcolor: '#409EFF',
            //       index: 'Statistic_List',
            //       title: '课程统计'
            //     },
            //     // {
            //     //   bgcolor:'#409EFF',
            //     //   index: 'Exam_Statistic',
            //     //   title: '人员统计'
            //     // }
            //   ]
            // }
          ]
        },
        {
          icon: 'el-icon-setting',
          index: 'Setting',
          title: '系统设置',
          menu: [{
              index: '1',
              title: '机构管理',
              subs: [{
                  index: 'OrganizationInfo',
                  title: '机构信息'
                },
                {
                  index: 'OrganizationSettings',
                  title: '参数设置'
                },
              ]
            },
            {
              index: '2',
              title: '管理员管理',
              subs: [{
                index: 'Administrator_List',
                title: '管理员列表'
              }]
            }
          ]
        },
        // {
        //     icon: 'el-icon-message',
        //     index: 'Service',
        //     title: '在线客服'
        // },
        // {
        //     icon: 'el-icon-star-off',
        //     index: 'Mall',
        //     title: '商城'
        // },
        // {
        //     icon: 'el-icon-time',
        //     index: 'Learn',
        //     title: '在线学习'
        // }
      ],
      router: '/Business',
      Navs: router.options.routes.filter(item => {
        return item.path === '/'
      })[0].children.filter(item2 => {
        return item2.index !== undefined
      }),
      orgList: '',
      choeseOrg: '',
      orgLogo: '',
      qwe: 0,
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  computed: {
    onOrgs() {
      var oid = parseInt(window.localStorage.saasoid);
      if (window.localStorage.saasorgList !== undefined) {
        this.orgList = JSON.parse(window.localStorage.saasorgList);

        for (var i in this.orgList) {
          if (this.orgList[i].id === oid) {
            this.choeseOrg = this.orgList[i].name;
            this.orgLogo = this.orgList[i].logoUrl;
          }
        }
        this.qwe++;
        return this.orgList;
      }
    },
    onRoutes() {
      var path = this.$route.path.replace('/', '');
      if (path === "") {
        this.$router.push('/Login');
      } else if (path === "Business") {
        this.$router.push('/Plate');
      } else if (path === "Setting") {
        this.$router.push('/OrganizationInfo');
      } else if (path === "OrganizationInfo" || path === "AdministratorList") {
        path = "Setting"
        this.router = "/Setting";
      } else {
        path = "Business"
        this.router = "/Business";
      }
      // console.log('path ' + path);
      return path;
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
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
      this.router = key;
    },
    login: function() {
      this.$router.push('/Login');
    },
    logout: function() {
      requestloginOut().then(data => {
        if (data.success) {
          localStorage.clear();
          this.$router.push('/Login');
        } else {
          // this.message = data.resMsg;
          this.openError(data.resMsg);
        }
      });
    },
    mydata: function() {
      this.$router.push('/UpdMsg');
    },
    updpwd: function() {
      this.$router.push('/UpdPwd');
    },
    handleCommand(oL) {
      // console.log(oL);
      this.choeseOrg = oL.name;
      window.localStorage.saasorg = JSON.stringify(oL);
      window.localStorage.saasoid = oL.id;
      window.location.reload();
    }
  }
}
</script>

<style>
  .active-item {
    color: #20a0ff;
  }
</style>
