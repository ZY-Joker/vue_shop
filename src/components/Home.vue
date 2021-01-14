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
        <el-aside width="200px">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>人员管理</span>
              </template>
              <el-menu-item index="1-1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>人员管理</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main></el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    LoginOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
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
}
.el-main{
  background-color: #eaedf1;
}
</style>
