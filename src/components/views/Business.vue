<template>
<div class="BottomDiv">
  <el-col :span="4" class="sidebar" v-if="hackReset">
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" unique-opened router style="background:#FFFFFF">
      <template v-for="item in menulist">
        <el-submenu :index="item.index" :key="item.index">
          <template slot="title">{{ item.title.replace('ThemeName', ThemeName) }}</template>
          <el-menu-item v-for="(subItem,i) in item.children" :key="i" :index="subItem.index" :id="subItem.index" @click="MenuCheck(subItem.index)" active-text-color="#FFFFFF">{{ subItem.title.replace('ThemeName', ThemeName) }}
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
      nav: 'Business',
      // menulist: router.options.routes.filter(item=>{
      //   return item.path==='/'
      // })[0].children.filter(item2=>{
      //   return item2.index==='Business'
      // })[0].children,
      menulist: this.$store.state.menulist.filter(item2 => {
        return item2.index === 'Business'
      })[0].children,
      computpath: '',
      ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : '',
      hackReset: true
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  mounted() {
    var path = this.$route.path.replace('/', '');
    // console.log(path);
    // console.log(this.menulist);
    this.MenuCheck(path);
  },
  computed: {
    onRoutes() {
      var path = this.$route.path.replace('/', '');
      if (path === "AddTeacher") {
        path = "TeacherList"
      }
      if (path === "FirstP_List") {
        this.$router.push('/Plate');
      }
      if (path === "Plate" || path === "Carousel" || path === "AddCarousel" || path === "UpdCarousel") {
        path = "HomePage";
      }

      if (path === "AddDepart") {
        path = "DepartList";
      }
      if (path === "AddTag") {
        path = "TagList";
      }
      if (path === "AddPersonnel") {
        path = "PersonnelList";
      }

      if (path === "Course" || path === "CourseSort" || path === "AddCourse" || path === "AddCourseSort" || path === "Chapter" || path === "UpdCourse" || path === "UpdCourseSort") {
        path = "CourseList"
      }
      return path;
    }
  },
  methods: {
    hack() {
      // console.log('hack it!');
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
      })
    },
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
      // for (var i in this.menus) {
      //   for (var j in this.menus[i].subs) {
      //     if (this.menus[i].subs[j].index === index) {
      //       document.getElementById(this.menus[i].subs[j].index).style.backgroundColor = '#409EFF';
      //       document.getElementById(this.menus[i].subs[j].index).style.color = '#FFFFFF';
      //     } else {
      //       document.getElementById(this.menus[i].subs[j].index).style.backgroundColor = '#FFFFFF';
      //       document.getElementById(this.menus[i].subs[j].index).style.color = '#48576A';
      //     }
      //   }
      // }
      // this.hack();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
