<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--登陆表单区-->
      <!--Form组件提供了表单校验功能，只需要通过rules属性传入约定的验证规则，并将Form-Item的prop属性设置为须校验的字段名即可-->
      <!--validate对整个表单进行校验-->
      <el-form ref="LoginForm" :model="form" :rules="LoginRules" label-width="0" class="login_form">
        <el-form-item prop="username">
          <el-input  prefix-icon="el-icon-user" v-model="form.username" ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"  prefix-icon="el-icon-lock" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="Login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      // 表单的验证规则
      LoginRules: {
        username: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 3, max: 10, message: '用户账号在3-10之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // 重置
      this.$refs.LoginForm.resetFields()
    },
    Login () {
      this.$refs.LoginForm.validate(async valid => {
        // console.log(valid)  返回布尔值
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.form)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
          return this.resetLoginForm()
        } else {
          this.$message.success('登陆成功')
        //  1.将登陆成功后的token，保存到客户端的sessionStorage中
          // 1.1 项目中出了登录之外的其他API接口，必须在登录之后才能的访问
          // 1.2 token 只应在当前网站打开期间生效，所以将 token 保存在sessionStorage 中
        // 2.通过编程式导航跳转到后台主页，路由地址是/home
        }
      })
    }
  }
}
</script>
<!-- 去掉scoped 全局生效-->
<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  /*尾部对齐*/
  justify-content: flex-end;
}
</style>
