<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
    <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 通过插槽获取数据 -->
          <template slot-scope="scope">
            <el-row :class="['bdbody',i1 === 0 ? 'bdtop':'','vccenter' ]" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close='removeRightById(scope.row,item1.id)'>
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环渲染二级权限 -->
                <el-row :class="[ i2 === 0 ? '':'bdtop' ,'vccenter']"  v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span='6'>
                    <el-tag type="success" closable @close='removeRightById(scope.row,item2.id)'>
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span='18'>
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id"
                    closable @close='removeRightById(scope.row,item3.id)'>
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button @click="showSetRightDialog(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限对话框 -->
      <el-dialog width="50%" title="分配权限" :visible.sync="setRightDialogVisible"
        @close="setRightDialog">
        <!-- 主体内容，树形控件 难点-->
        <el-tree :default-checked-keys="defKeys" ref="treeRefs" :data="rightsList" node-key="id" default-expand-all show-checkbox :props="rightProps"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <!-- 点击角色分配权限 -->
          <el-button type="primary" @click="allotRights" >确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>

</template>

<script>
export default {
  data () {
    return {
      // 所有权限列表数据
      rightsList:[],
      rightProps:{
        children: 'children',
        label: 'authName'
      },
      // 所有角色列表数据
      roleList:[],
      // 默认设置分配角色权限对话框隐藏
      setRightDialogVisible:false,
      // 默认选中节点Id的数组值
      defKeys:[],
      // 角色Id
      roleId:''
    }
  },
  created(){
    this.getRolesList()
  },
  methods:{
    // 获取角色列表数据
    async getRolesList() {
      const { data:res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roleList = res.data
    },
    // 删除角色指定权限
    async removeRightById(row,rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data:res } = await this.$http.delete(`roles/${row.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 将返回的当前角色下最新的权限数据赋值
      row.children = res.data
    },
    // 展示分配角色权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data:res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightsList = res.data
      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible = ! this.setRightDialogVisible
    },
    //通过递归的形式，获取角色下所有三级权限的id，并保存defKeys数组中
    getLeafKeys(node,arr) {
      // 如果当前node节点不包括children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item,arr))
    },
    // 监听分配权限对话框事件，对defkeys初始化
    setRightDialog(){
      this.defKeys = []
    },
    // 获取半选和全选的权限的id
    async allotRights(){
      // js展开运算符
      const keys = [
        ...this.$refs.treeRefs.getCheckedKeys(),
        ...this.$refs.treeRefs.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data:res } = await this.$http.post(`roles/
      ${this.roleId}/rights`,{
        rids:idStr
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px
}
.bdtop{
  border-top:1px solid #eee;
}
.bdbody{
  border-bottom:1px solid #eee;
}
.vccenter{
  display:flex;
  align-items: center;
}
</style>
