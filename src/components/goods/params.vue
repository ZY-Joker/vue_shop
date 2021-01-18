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
            <el-button type="primary" size="mini" :disabled="isDisabled">添加参数</el-button>
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
                <template>
                  <el-tooltip  effect="dark" content="修改角色" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="mini" >编辑</el-button>
                  </el-tooltip>
                  <el-tooltip  effect="dark" content="删除角色" placement="top"  :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isDisabled">添加属性</el-button>
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
                <template>
                  <el-tooltip  effect="dark" content="修改角色" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="mini" >编辑</el-button>
                  </el-tooltip>
                  <el-tooltip  effect="dark" content="删除角色" placement="top"  :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
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
      onlyTable: []
    }
  },
  created () {
    this.getParamsList()
  },
  computed: {
    cateId () {
      if (this.selectcat.length === 3) return this.selectcat[2]
      return null
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
        console.log(this.activeName)
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        console.log(res.data)
        if (this.activeName === 'many') {
          this.manyTable = res.data
        } else {
          this.onlyTable = res.data
        }
      }
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
