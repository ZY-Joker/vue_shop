<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable = "false">
      </el-alert>
<!--步骤条区-->
      <el-steps :active="activeIndex" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px" label-position="top">
      <el-tabs :tab-position="'left'" @tab-click="tabClick" :before-leave="beforeTab" v-model="activeIndex" style="margin-left:50px;margin-top:40px">
        <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="form.goods_name"></el-input>
            </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="form.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="form.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="form.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类"  prop="goods_cat">
            <el-cascader
              v-model="form.goods_cat"
              :options="cateList"
              :props="cateProps"
              @change="handleChange" clearable></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数"  name="2" >
          <el-form-item :label="item.attr_name" v-for="item in manyTable" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="c" v-for="(c, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">
          <el-form-item :label="item.attr_name" v-for="item in onlyTable" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4">
          <el-upload
            class="upload-demo"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
            :on-success="handleSuccess"
            :headers="headerObj">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <quill-editor
            v-model="form.goods_introduce"
          />
          <el-button size="small" type="primary" class="btnAdd" @click="add">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%">
      <img :src="previewPath" alt="" class="preview">
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Add',
  data () {
    return {
      activeIndex: '1',
      form: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      formRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请输入商品分类', trigger: 'change' }]
      },
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTable: [],
      onlyTable: [],
      uploadURL: 'http://www.ysqorz.top:8888/api/private/v1/upload',
      fileList: [],
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewDialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    cateId () {
      if (this.form.goods_cat.length === 3) return this.form.goods_cat[2]
      return null
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类失败')
      this.cateList = res.data
    },
    async handleChange () {
      const value = this.form.goods_cat
      if (value.length !== 3) {
        this.form.goods_cat = []
        return 0
      }
    },
    beforeTab (activeName, oldActiveName) {
      if (oldActiveName === '1' && this.form.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClick () {
      if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTable = res.data
      } else if (this.activeIndex === '3') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyTable = res.data
      }
    },
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const i = this.form.pics.findIndex(x => x.pic === filePath
      )
      this.form.pics.splice(i, 1)
    },
    handlePreview (file) {
      this.previewPath = 'http://www.ysqorz.top:8888/' + file.response.data.tmp_path
      this.previewDialogVisible = true
    },
    handleSuccess (response) {
      const picInfo = { pic: response.data.tmp_path }
      this.form.pics.push(picInfo)
    },
    add () {
      this.$refs.formRef.validate(async valid => {
        // eslint-disable-next-line no-useless-return
        if (!valid) return this.$message.error('请填写必要的表单项')
        /* 可以发起网络请求 */
        // lodash cloneDeep(obj) 深拷贝
        const form2 = _.cloneDeep(this.form)
        this.form.goods_cat = form2.goods_cat.join(',')
        this.manyTable.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.form.attrs.push(newInfo)
        })
        this.onlyTable.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.form.attrs.push(newInfo)
        })
        form2.attrs = this.form.attrs
        const { data: res } = await this.$http.post('goods', form2)
        if (res.meta.status !== 201) {
          this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.activeIndex = '6'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.preview{
  width: 100%;
}
.btnAdd {
  margin-top:15px;
}
</style>
