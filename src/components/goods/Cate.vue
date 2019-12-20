<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table class="treeTable" :data="catelist" :columns="columns" show-index :show-row-hover="false"
       :selection-type="false" :expand-type="false" border>
       <!-- 是否有效模板 -->
        <template slot="isok" scope="scope">
          <i v-if="scope.row.cat_deleted == false" class="el-icon-success" style="color:#67C23A"></i>
          <i v-else class="el-icon-error"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" scope="scope">
          <el-tag v-if="scope.row.cat_level == '0'" size="mini">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level == '1'" size="mini">二级</el-tag>
          <el-tag type="warning" v-else size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="ipt">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
        <!-- 主体区域 -->
        <el-form  :model="addCateForm" :rules="addCateFormRules" ref="addCateFormmRef" label-width="100px">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data(){
    return {
      // 商品分类的数据列表，默认为空
      catelist:[],
      // 总数据条数
      total:0,
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      // 添加分类的表单数据名称
      addCateForm:{
        // 将要添加的分类对象
        cat_name:'',
        // 父级分类的id
        cat_id:0,
        //分类的等级，默认是要添加的1级分类
        cat_level:0
      },
      // 添加分类对话框的显示与隐藏
      addCateDialogVisible:false,
      //表格各列的配置
      columns: [
          {
            label: '分类名称',
            prop: 'cat_name'
          },
          {
            label: '是否有效',
            prop:'cat_deleted',
            //表示将当前列，设置为模板列
            type: 'template',
            // 表示当前列使用的模板名称
            template: 'isok'
          },
          {
            label: '排序',
            prop:'cat_level',
            //表示将当前列，设置为模板列
            type: 'template',
            // 表示当前列使用的模板名称
            template: 'order'
          },
          {
            label: '操作',
            prop:'cat_level',
            //表示将当前列，设置为模板列
            type: 'template',
            // 表示当前列使用的模板名称
            template: 'ipt'
          }
        ],
        // 添加分类表单规则对象
        addCateFormRules:{
          cat_name:[
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
        parentCateList:[]
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    async getCateList() {
      const { data:res } = await this.$http.get('categories',{ params:this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      //把数据列表，赋值给catelist
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击添加分类按钮显示添加分类对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 在显示分类对话框
      this.addCateDialogVisible = true
    },
    // 获得父级分类的数据列表
    async getParentCateList() {
      const { data:res } = await this.$http.get('categories',{ params:{ type:2 } })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res.data)
      this.parentCateList = res.data
    }
  }
}
</script>
<style lang="less" scoped>
  .treeTable {
    margin-top: 15px;
  }
</style>