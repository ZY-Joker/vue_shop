<template>
    <el-container class="home_container">
      <el-header>
        <div>
          <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1109100168,4167510204&fm=26&gp=0.jpg" alt="" style="width: 100px;height: 60px;">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="LoginOut">退出</el-button>
      </el-header>
      <!--页面主体区-->
      <el-container>
        <el-aside :width="isTrue ? '64px' : '200px'" >
          <div class="toggle-button" @click="toggle">
            |||
          </div>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :collapse="isTrue"
            :collapse-transition="false"
            :router="true"
           >
            <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id" >
              <template slot="title">
                <i :class="icons[item.id]" ></i>
                <span style="margin-left: 10px;">{{item.authName}}</span>
              </template>
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      icons: {
        125: 'iconfont el-icon-s-custom',
        103: 'iconfont el-icon-menu',
        101: 'iconfont el-icon-coin',
        102: 'iconfont el-icon-document-copy',
        145: 'iconfont el-icon-s-data'
      },
      isTrue: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    LoginOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else {
        this.menulist = res.data
        return this.$message.success(res.meta.msg)
      }
    },
    // 点击按钮，切换菜单的折叠展开
    toggle () {
      this.isTrue = !this.isTrue
    }
  }
}
</script>

<style type="less" scoped>
.home_container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  /* 左右贴边对其 */
  padding-left:0;
  align-items: center;
  color:#FFF;
  font-size: 20px;
}
/* 纵向上实现居中对齐 */
.el-header > div{
  display: flex;
  align-items: center;
  span{
    margin-left: 15px;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.el-main{
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4A5064;
  font-size:10px;
  line-height: 24px;
  color:#fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
