<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头部图标 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 用户登录表单 -->
            <!-- 这里loginFormRef是引用对象，rules是验证规则 -->
            <el-form ref="loginFormRef" label-width="0px" :model="loginForm" :rules="loginFormRules" class="login_form">
                <!-- user name -->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username" ></el-input>
                </el-form-item>
                <!-- user password -->
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-3702mima"  v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <!-- button -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            loginForm:{
                username:'admin',
                password:'123456'
            },
            //这是表单验证规则对象
            loginFormRules:{
                //验证用户名是否合法
                username:[
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 2, max: 6, message: '长度在 2 到 6个字符', trigger: 'blur' }
                ],
                //验证密码是否合法
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        //对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields()
        },
        //实现登录表单数据登录前的预验证
        login(){
            this.$refs.loginFormRef.validate(async val => {
                if (!val) return
                const ret = await this.$http.post('login',this.loginForm)
                if (ret.data.meta.status !== 200) return this.$message.error('登录失败')
                this.$message.success('登录成功')
                //1.将登录成功之后的token，保存到客户端的sessionStorage中
                //  1.1项目中除了登录之外的其他api接口，必须在登录之后才能访问
                //  1.2token只应在当前网站打开期间生效，所以token保存在sessionStorage中
                window.sessionStorage.setItem('token',ret.data.data.token)
                //2.通过编程式路由导航跳转到后台主页，路由地址是/home
                this.$router.push('/home')
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .login_container{
        background: #2b4b6b;
        height:100%;
        .login_box{
                position: absolute;
                left: 50%;
                top:50%;
                transform: translate(-50%,-50%);
                width: 450px;
                height:300px;
                border-radius:3px; 
                background: #fff;
                .avatar_box{
                    width:130px;
                    height:130px;
                    padding: 10px;
                    border:1px solid #eee;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #eee;
                    background:#fff;
                    position: absolute;
                    left:50%;
                    transform: translate(-50%,-50%);
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius:50%;
                        background:#eee;
                    }
                }
            }
    }
    .login_form{
       position: absolute; 
       bottom: 0px;
       width: 100%;
       padding: 0 10px;
       box-sizing: border-box;
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
</style>