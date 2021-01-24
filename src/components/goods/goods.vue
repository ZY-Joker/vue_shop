<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    卡片视图区-->
    <el-card>
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary"  @click="dialogVisible = true">添加商品</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="goodsList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="580">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="goods_number"
          label="数量">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="重量">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作" width="300px">
          <template slot-scope="scope">
            <el-tooltip  effect="dark" content="修改商品" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip  effect="dark" content="删除商品" placement="top"  :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGood(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区-->
      <el-pagination
        style="margin-top:10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 100, 400]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
     </el-card>
  </div>
</template>

<script>
export default {
  name: 'goods',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      else {
        console.log(res.data.goods)
        this.goodsList = res.data.goods
        this.total = res.data.total
      }
    },
    edit (id) {},
    deleteGood (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('goods/' + id)
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
        this.getGoodsList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addGood (id) {}
  }
}
</script>

<style scoped>

</style>
