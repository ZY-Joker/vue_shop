<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-alert
          title="注意：只允许为第三级分类设置相关参数!"
          type="warning"
          :closable="false"
          show-icon>
        </el-alert>
          <el-row calss="cat_opt">
            <el-col>
              <span>选择商品分类</span>
              <el-cascader
                v-model="selectcat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange" clearable></el-cascader>
            </el-col>
          </el-row>

        <el-tabs v-model="activeName" @tab-click="handleChange">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="isDisabled" @click="dialogVisible = true">添加参数</el-button>
            <el-table
              :data="manyTable"
              border
              stripe
              style="width: 100%">
              <el-table-column
                type="index">
              </el-table-column>
              <el-table-column
                prop="attr_name"
                label="参数名称"
                width="300">
              </el-table-column>
              <el-table-column
                label="操作" >
                <template slot-scope="scope">
                  <el-tooltip  effect="dark" content="修改角色" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row.attr_id)">编辑</el-button>
                  </el-tooltip>
                  <el-tooltip  effect="dark" content="删除角色" placement="top"  :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="Delete(scope.row.attr_id)">删除</el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isDisabled" @click="dialogVisible = true">添加属性</el-button>
            <el-table
              :data="onlyTable"
              border
              stripe
              style="width: 100%">
              <el-table-column
                type="index">
              </el-table-column>
              <el-table-column
                prop="attr_name"
                label="参数名称"
                width="300">
              </el-table-column>
              <el-table-column
                label="操作" >
                <template slot-scope="scope">
                  <el-tooltip  effect="dark" content="修改角色" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row.attr_id)">编辑</el-button>
                  </el-tooltip>
                  <el-tooltip  effect="dark" content="删除角色" placement="top"  :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="Delete(scope.row.attr_id)">删除</el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="dialogVisible"
        width="50%"
        @close="paramesClosed"
      >
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addParam">添加</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog
        :title="'修改'+titleText"
        :visible.sync="EditdialogVisible"
        width="50%"
        @close="EditClosed"
      >
        <el-form :model="EditForm" :rules="EditFormRules" ref="EditFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="EditForm.attr_name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="EditParam">修改</el-button>
            <el-button @click="EditdialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'params',
  data () {
    return {
      cateList: [],
      selectcat: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 被激活的页签
      activeName: 'many',
      isDisabled: true,
      manyTable: [],
      onlyTable: [],
      dialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      EditdialogVisible: false,
      EditForm: {
      },
      EditFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getParamsList()
  },
  computed: {
    cateId () {
      if (this.selectcat.length === 3) return this.selectcat[2]
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  methods: {
    async getParamsList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) this.$message.error('获取商品分类失败')
      this.cateList = res.data
    },
    async handleChange () {
      const value = this.selectcat
      if (value.length !== 3) {
        this.selectcat = []
        this.isDisabled = true
        return 0
      } else {
        this.isDisabled = false
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        if (this.activeName === 'many') {
          this.manyTable = res.data
        } else {
          this.onlyTable = res.data
        }
      }
    },
    paramesClosed () {
      this.$refs.addFormRef.resetFields()
    },
    EditClosed () {
      this.$refs.EditFormRef.resetFields()
    },
    addParam () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return 0
        else {
          const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName
            })
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.dialogVisible = false
          this.getParamsList()
          this.handleChange()
        }
      })
    },
    async showEdit (id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.$message.success(res.meta.msg)
      this.EditForm = res.data
      this.EditdialogVisible = true
    },
    EditParam () {
      this.$refs.EditFormRef.validate(async valid => {
        if (!valid) return 0
        else {
          const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.EditForm.attr_id}`,
            {
              attr_name: this.EditForm.attr_name,
              attr_sel: this.activeName
            })
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.EditdialogVisible = false
          this.getParamsList()
          this.handleChange()
        }
      })
    },
    Delete (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
        this.getParamsList()
        this.handleChange()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin: 20px 0;
}
.el-cascader{
  margin-left:20px;
}
</style>
