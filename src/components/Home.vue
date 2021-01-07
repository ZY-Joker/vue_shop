<template>
  <div>
    <el-button type="info" @click="LoginOut">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    LoginOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
