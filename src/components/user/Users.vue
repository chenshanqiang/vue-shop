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
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
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
        <el-table-column  label="状态">
          <!--
            1.作用插槽的使用,通过scope.row获得作用域的值
            2.这里父组件是el-table，父组件将值userlist传给了子组件，
            然后通过template的slot-scope属性获得了userlist值，对子组件的
            内容进行加工处理
          -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column  label="操作"  width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUserById(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 主体区域 -->
        <el-form  :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户信息对话框 -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!-- 主体区域 -->
        <el-form  :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="姓名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible"
        width="50%" @close="setRoleDialogClosed">
        <div>
          <p>当前的用户：{{userInfo.username}}</p>
          <p>当前的角色：{{userInfo.role_name}}</p>
          <p>分配新角色：
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data(){
    //自定义定义验证邮箱的规则
    var checkEmail = (rule,value,callback) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    //自定义定义验证手机的规则
    var checkMobile = (rule,value,callback) => {
      //验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      //获取用户列表的参数对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:2
      },
      userList:[],
      total:0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible:false,
      //控制修改用户信息对话框的显示与隐藏
      editDialogVisible:false,
      //添加用户信息
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //查询到的用户信息
      editForm:{},
      //校验规则
      addFormRules:{
        //验证用户名是否合法
        username:[
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6个字符', trigger: 'blur' }
        ],
        //验证密码是否合法
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
         //验证邮箱是否合法
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框显示与隐藏
      setRoleDialogVisible:false,
      //分配角色的用户信息
      userInfo:{},
      // 角色列表
      rolesList:[],
      selectedRoleId:''

    }
  },
  methods:{
      async getUserList () {
        const { data:res } = await this.$http.get('users',{ params:this.queryInfo })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.userList = res.data.users
        this.total = res.data.total
      },
      //监听pagesize改变的事件
      handleSizeChange(pagesize) {
        this.queryInfo.pagesize = pagesize
        this.getUserList()
      },
      //监听页码值改变的事件
      handleCurrentChange(pagenum) {
        this.queryInfo.pagenum = pagenum
        this.getUserList()
      },
      //监听swith状态变化
      async userStateChanged(userinfo) {
        const { data:res } = await this.$http.put(`users/${
          userinfo.id} /state/${userinfo.mg_state}`)
        if (res.meta.status !== 200) {
          userinfo.mg_state = ! userinfo.mg_state
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
      },
      //监听添加用户对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      //点击按钮,添加用户
      addUser() {
        this.$refs.addFormRef.validate(async val => {
          if (!val) return
          const { data:res } = await this.$http.post('/users',this.addForm)
          //可以发起添加用户的请求
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          //隐藏添加用户对话框
          this.addDialogVisible = false
          //重新获取用户列表
          this.getUserList()
        })
      },
      //监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
       //点击按钮,修改用户
      async showEditDialog(id) {
        const { data:res } = await this.$http.get('users/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.editForm = res.data
        this.editDialogVisible = true
      },
      //修改用户信息
      editUserInfo(id) {
        //用户信息修改预验证
        this.$refs.editFormRef.validate(async valid => {
            if (!valid) return
            const { data:res } = await this.$http.put('users/' + this.editForm.id,{
              email:this.editForm.email,
              mobile:this.editForm.mobile
            })
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            //关闭对话框
            this.editDialogVisible = false
            //重新获取数据列表
            this.getUserList()
            //数据修改成功
            this.$message.success(res.meta.msg)
        })
      },
      //删除用户信息
      async delUserById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消删除，则返回值为字符串 cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        const { data:res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getUserList()
      },
      //点击按钮显示分配角色对话框
      async setRole(userinfo) {
        this.userInfo = userinfo
        //在展示对话框之前，获取所有角色的列表
        const { data:res } = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.rolesList = res.data
        this.setRoleDialogVisible = true
      },
      // 点击按钮分配角色
      async saveRoleInfo() {
        if (!this.selectedRoleId) {
          return this.$message.error('请选择要分配的角色')
        }
        const { data:res } = await this.$http.put(
          `users/${this.userInfo.id}/role`,{
          rid:this.selectedRoleId
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('更新角色成功！')
        this.getUserList()
        this.setRoleDialogVisible = false
      },
      //监听分配角色对话框关闭事件
      setRoleDialogClosed() {
        this.selectedRoleId = ''
        this.userInfo = ''
      }
  },
  created () {
    this.getUserList()
  }
}
</script>
<style lang="less" scoped>

</style>
