<template>
<div class="BottomDiv">
  <el-col :span="4" class="sidebar">
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" unique-opened router style="background:#FFFFFF">
      <template v-for="item in menulist">
        <el-submenu :index="item.index" :key="item.items" @click="Menuopen(item.subs)">
          <template slot="title">{{ item.title }}</template>
          <el-menu-item v-for="(subItem,i) in item.children" :key="i" :index="subItem.index" :id="subItem.index" @click="MenuCheck(subItem.index)" active-text-color="#FFFFFF">{{ subItem.title }}
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </el-col>
  <el-col class="content" :span="20">
    <router-view></router-view>
  </el-col>
</div>
</template>

<script>
export default {
  data() {
    return {
      menulist: this.$store.state.menulist.filter(item2 => {
        return item2.index === 'Setting'
      })[0].children,
      items: [{
          index: '1',
          title: '机构管理',
          subs: [{
              index: 'OrganizationList',
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
            index: 'AdministratorList',
            title: '管理员列表'
          }]
        }
        // {
        //   index: '3',
        //   title: '资源管理',
        //   subs: [{
        //     index: 'FileList',
        //     title: '资源列表'
        //   }]
        // },
        // {
        //   index: '4',
        //   title: '通讯录',
        //   subs: [{
        //       index: 'DepartmentList',
        //       title: '部门管理'
        //     },
        //     {
        //       index: 'TagList',
        //       title: '标签管理'
        //     },
        //     {
        //       index: 'PersonnelList',
        //       title: '人员管理'
        //     }
        //   ]
        // }
      ]
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  mounted() {
    var path = this.$route.path.replace('/', '');
    this.MenuCheck(path);
    // this.qwe++;
  },
  computed: {
    onRoutes() {
      var path = this.$route.path.replace('/', '');
      return path;
    }
  },
  methods: {
    MenuCheck(index) {
      for (var i in this.menulist) {
        for (var j in this.menulist[i].children) {
          if (this.menulist[i].children[j].index === index) {
            document.getElementById(this.menulist[i].children[j].index).style.backgroundColor = '#409EFF';
            document.getElementById(this.menulist[i].children[j].index).style.color = '#FFFFFF';
          } else {
            if(this.menulist[i].children[j].children) {
              for (var k in this.menulist[i].children[j].children) {
                if (this.menulist[i].children[j].children[k].index === index) {
                  // console.log(this.menulist[i].children[j].index);
                  document.getElementById(this.menulist[i].children[j].index).style.backgroundColor = '#409EFF';
                  document.getElementById(this.menulist[i].children[j].index).style.color = '#FFFFFF';
                  break;
                } else {
                  document.getElementById(this.menulist[i].children[j].index).style.backgroundColor = '#FFFFFF';
                  document.getElementById(this.menulist[i].children[j].index).style.color = '#48576A';
                }
              }
            } else {
              document.getElementById(this.menulist[i].children[j].index).style.backgroundColor = '#FFFFFF';
              document.getElementById(this.menulist[i].children[j].index).style.color = '#48576A';
            }
          }
        }
      }
      // for (var i in this.items) {
      //   for (var j in this.items[i].subs) {
      //     if (this.items[i].subs[j].index === index) {
      //       document.getElementById(this.items[i].subs[j].index).style.backgroundColor = '#409EFF';
      //       document.getElementById(this.items[i].subs[j].index).style.color = '#FFFFFF';
      //     } else {
      //       document.getElementById(this.items[i].subs[j].index).style.backgroundColor = '#FFFFFF';
      //       document.getElementById(this.items[i].subs[j].index).style.color = '#48576A';
      //     }
      //   }
      // }
      // this.qwe++;
    },
    Menuopen(subs) {
      for (var i in subs) {

      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
