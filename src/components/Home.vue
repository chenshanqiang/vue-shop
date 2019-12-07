<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse? '64px': '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边导航栏 -->
        <!-- 使用unique属性时，要绑定该属性，否则只能是unique-opened-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" 
        :unique-opened="true"  :collapse="isCollapse" :collapse-transition="false" router 
        :default-active="activePath">
          <!-- 一级导航 -->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconobj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级导航 -->
              <el-menu-item :index="'/' + subItem.path +''" 
              v-for="subItem in item.children" 
              :key="subItem.id" @click="savaNavPath('/' + subItem.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
</el-container>
</template>
<script>
  export default {
    data () {
      return {
        menulist:[],//左侧菜单数据
        iconobj:{
          '125':'iconfont icon-users',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao'
        },
        isCollapse:false,
        activePath:''
      }
    },
    methods:{
      logout () {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      async getMenuList(){ 
        //获取侧边导航数据
        const { data:res } = await this.$http.get('/menus')
        if (res.meta.status !== 200) {
         return this.$message.error(res.meta.msg)
        }
        this.menulist = res.data
      },
      toggleCollapse(){ 
        //实现折叠与展开效果
        this.isCollapse = ! this.isCollapse
      },
      savaNavPath(activePath){ 
        //使用sessionStorage保存侧边导航激活的状态
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath//点击的时候给activePath赋值
      }
    },
    created () {
      this.getMenuList()
      //组件创建的时候给activePath赋值
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  }
</script>
<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color:#fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
    .toggle-button{
      background-color:#4a5064;
      text-align: center;
      color:#fff;
      font-size: 10px;
      height: 24px;
      line-height: 24px;
      letter-spacing: .2rem;
      cursor: pointer;
    }
    .el-menu{
      border-right:none;
    }
    .iconfont{
      margin-right: 10px;
    }
  }
  .el-main{
    background-color: #EAEDF1;
  }
</style>