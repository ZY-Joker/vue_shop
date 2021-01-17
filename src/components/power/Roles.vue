<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div style="margin-top: 15px;">
        <el-row >
          <el-col >
            <el-button type="primary"  @click="dialogVisible = true">添加角色</el-button>
          </el-col>
        </el-row>
      </div>
<!--      &lt;!&ndash;      对话框&#45;&#45;添加角色&ndash;&gt;-->
<!--      <el-dialog-->
<!--        title="添加用户"-->
<!--        :visible.sync="dialogVisible"-->
<!--        width="30%"-->
<!--      >-->
<!--        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">-->
<!--          <el-form-item label="用户名" prop="username">-->
<!--            <el-input v-model="addForm.username"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="密码" prop="password">-->
<!--            <el-input v-model="addForm.password"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="邮箱" prop="email">-->
<!--            <el-input v-model="addForm.email"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="手机号" prop="mobile">-->
<!--            <el-input v-model="addForm.mobile"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button type="primary" @click="adduser">添加用户</el-button>-->
<!--            <el-button @click="dialogVisible = false">取消</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </el-dialog>-->
      <el-table
        :data="RolesList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="expand">
          <template slot-scope="scope">
              <el-row :class="['bdbottom',  i1 === 0 ? '': 'bdtop','vcenter'] " v-for="(item1, i1) in scope.row.children" :key="item1.id" >
<!--                渲染一级权限-->
                <el-col :span="4">
                  <el-tag closable @close="removeRightById(scope.row,item1.id)"> {{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
<!--                渲染二级三级权限-->
                <el-col :span="20">
                  <el-row  :class="[i2 === 0 ? '': 'bdtop','vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                     <el-col :span="6">
                       <el-tag closable type="success"  @close="removeRightById(scope.row,item2.id)"> {{item2.authName}}</el-tag>
                       <i class="el-icon-caret-right"></i>
                     </el-col>
                    <el-col :span="18">
                      <el-tag closable type="warning" v-for="(item3 ) in item2.children" :key="item3.id" @close="removeRightById(scope.row,item3.id)">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述">
        </el-table-column>
        <el-table-column
          label="操作" width="400px">
          <template slot-scope="scope">
            <el-tooltip  effect="dark" content="修改角色" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)">编辑</el-button>
            </el-tooltip>
            <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRight(scope.row)">分配权限</el-button>
            </el-tooltip>
            <el-tooltip  effect="dark" content="删除角色" placement="top"  :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="分配权限"
        :visible.sync="setRightVisible"
        width="50%"
        @close="setRightClosed"
      >
        <el-tree
          :data="RightsTree"
          ref = "treeRef"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          :props="TreeProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightVisible = false">取 消</el-button>
          <el-button type="primary" @click="RightChange">确 定</el-button>
       </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      dialogVisible: false,
      RolesList: [],
      setRightVisible: false,
      RightsTree: [],
      /* 树形控件 */
      TreeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    edit (id) {},
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.RolesList = res.data
      this.$message.success('获取角色列表成功')
    },
    async showSetRight (role) {
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限失败')
      this.RightsTree = res.data
      this.roleId = role.id
      this.getLeafKeys(role, this.defKeys)
      this.setRightVisible = true
    },
    removeRightById (role, id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
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
        role.children = res.data
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 通过递归的形式，获取角色下所有三级权限的Id，并保存在defKeys中
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      } else {
        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        })
      }
    },
    // 监听分配权限对话框的关闭事件
    setRightClosed () {
      this.defKeys = []
    },
    async RightChange () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightVisible = false
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display:flex;
  align-items: center;
}
</style>
