<template>
 <div>
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>订单管理</el-breadcrumb-item>
     <el-breadcrumb-item>订单列表</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
     <div style="margin-top: 15px;">
       <el-row :gutter="20">
         <el-col :span="6">
           <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getOrderList">
             <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
           </el-input>
         </el-col>
       </el-row>
       <el-table
         :data="orderList"
         border
         stripe
         style="width: 100%">
         <el-table-column
           type="index">
         </el-table-column>
         <el-table-column
           prop="order_number"
           label="订单编号"
           width="380">
         </el-table-column>
         <el-table-column
           prop="order_price"
           label="订单价格">
         </el-table-column>
         <el-table-column
           prop="order_pay"
           label="是否付款">
           <template slot-scope="scope">
             <el-tag v-if="scope.row.order_pay === '1'" type="success">已付款</el-tag>
             <el-tag v-else type="danger">未付款</el-tag>
           </template>
         </el-table-column>
         <el-table-column
           prop="is_send"
           label="是否发货">
         </el-table-column>
         <el-table-column
           prop="create_time"
           label="下单时间">
           <template slot-scope="scope">
             {{scope.row.create_time | dateFormat }}
           </template>
         </el-table-column>
         <el-table-column
           label="操作" width="300px">
           <template slot-scope="scope">
             <el-tooltip  effect="dark" content="查看物流"  placement="top" :enterable="false">
               <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.order_id)" ></el-button>
             </el-tooltip>
             <el-tooltip  effect="dark" content="修改地址" placement="top" :enterable="false">
               <el-button type="warning" icon="el-icon-setting" size="mini" @click="editAddress(scope.row.order_id)"></el-button>
             </el-tooltip>
           </template>
         </el-table-column>
       </el-table>
     </div>

     <el-dialog
       title="修改地址"
       :visible.sync="editdialogVisible"
       width="50%"
     >
       <el-form :model="addressForm" :rules="addressRules" ref="addressForm" label-width="70px">
         <el-form-item label="省市区/县" prop="address1">
           <el-input v-model="addressForm.address1"></el-input>
         </el-form-item>
         <el-form-item label="详细地址" prop="address2">
           <el-input v-model="addressForm.address2"></el-input>
         </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="editgood">修改</el-button>
           <el-button @click="editdialogVisible = false">取消</el-button>
         </el-form-item>
       </el-form>
     </el-dialog>
     <el-dialog
       title="展示物流进度"
       :visible.sync="progressdialogVisible"
       width="50%"
     >
      {{progressForm}}
     </el-dialog>
     <el-pagination
       style="margin-top:10px;"
       @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
       :current-page="queryInfo.pagenum"
       :page-sizes="[2, 10, 100, 400]"
       :page-size="queryInfo.pagesize"
       layout="total, sizes, prev, pager, next, jumper"
       :total="total">
     </el-pagination>
   </el-card>
 </div>
</template>

<script>
export default {
  name: 'order',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      orderList: [],
      total: 0,
      editdialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressRules: {
        address1: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      progressdialogVisible: false,
      progressForm: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrderList()
    },
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      else {
        this.orderList = res.data.goods
        this.total = res.data.total
      }
    },
    async editAddress (id) {
      const { data: res } = await this.$http.get('orders/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.addressForm = res.data
      this.editdialogVisible = true
    },
    async edit (id) {
      const { data: res } = await this.$http.get('/kuaidi/' + 1106975712662)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.progressForm = res.data
      this.progressdialogVisible = true
    },
    editgood () {}
  }
}
</script>

<style scoped>

</style>
