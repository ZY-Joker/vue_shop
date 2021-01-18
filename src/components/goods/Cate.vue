<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div style="margin-top: 15px;">
        <el-row >
          <el-col >
            <el-button type="primary"  @click="showAddCate">添加分类</el-button>
          </el-col>
        </el-row>
      </div>
            <!--      对话框--添加分类-->
            <el-dialog
              title="添加分类"
              :visible.sync="dialogVisible"
              width="50%"
              @close="CateClosed"
            >
              <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                  <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                  <el-cascader expand-trigger="hover" v-model="selectedParentCateList" :options="ParentCateList"
                  :props="CascaderProps" @change="handleChange" clearable change-on-select>
                  </el-cascader>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="addCat">添加用户</el-button>
                  <el-button @click="dialogVisible = false">取消</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
      <tree-table
          class="treeTable"
          :data="cateList"
          :columns="columns"
          show-index
          index-text="#"
          :expand-type="false"
          :show-row-hover="false"
          :selection-type="false" border>
        <template slot-scope="scope" slot="isok">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen;"></i>
          <i v-else class="el-icon-error" style="color:red"></i>
        </template>
        <template slot-scope="scope" slot="sort">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <template slot-scope="scope" slot="opt">
          <el-tooltip  effect="dark" content="修改角色" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)">编辑</el-button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="删除角色" placement="top"  :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </el-tooltip>
        </template>
      </tree-table>

      <el-pagination
        style="margin-top:10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 100, 400]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      dialogVisible: false,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      }, {
        label: '排序',
        type: 'template',
        template: 'sort'
      }, {
        label: '操作',
        type: 'template',
        template: 'opt'
      }],
      addCateForm: {
        cat_name: '',
        cat_level: 0,
        cat_pid: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      ParentCateList: [],
      selectedParentCateList: [],
      // 指定级联选择器的选择对象
      CascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    edit () {},
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    async getGoodsList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
      this.$message.success(res.meta.msg)
    },
    showAddCate () {
      this.getParentCateList()
      this.dialogVisible = true
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类数据失败')
      this.ParentCateList = res.data
      this.$message.success('获取父级分类数据成功')
    },
    handleChange () {
      console.log(this.selectedParentCateList)
      if (this.selectedParentCateList.length > 0) {
        this.addCateForm.cat_pid = this.selectedParentCateList[this.selectedParentCateList.length - 1]
        this.addCateForm.cat_level = this.selectedParentCateList.length
        return 0
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    CateClosed () {
      this.selectedParentCateList = []
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    addCat () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        console.log(this.addCateForm)
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加分类数据失败')
        this.$message.success('添加分类数据成功')
        this.getGoodsList()
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top:15px;
}
.el-cascader {
  width: 100%;
}
</style>
