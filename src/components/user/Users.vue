<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">主要按钮</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <!-- 添加type属性值为index即索引列 -->
        <el-table-column  type="index"></el-table-column>
        <el-table-column  label="姓名" prop="username"></el-table-column>
        <el-table-column  label="邮箱" prop="email"></el-table-column>
        <el-table-column  label="电话" prop="mobile"></el-table-column>
        <el-table-column  label="角色" prop="role_name"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data(){
    return {
      //获取用户列表的参数对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:2
      },
      userList:[],
      total:0
    }
  },
  methods:{
      async getUserList(){
        const { data:res } = await this.$http.get('users',{ params:this.queryInfo })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.userList = res.data.users
        this.total = res.data.total
        console.log(res)
      }
  },
  created(){
    this.getUserList()
  }
}
</script>
<style lang="less" scoped>

</style>