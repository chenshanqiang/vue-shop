// 这是项目发布阶段需要用到的babel插件
// transform-remove-console插件在项目发布阶段移除console.log()命令
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
    prodPlugins.push('transform-remove-console')
}
module.exports = {
    presets: [
        '@vue/app'
    ],
    plugins: [
        [
            'component',
            {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk'
            }
        ],
        //发布产品时候的插件组件
        ...prodPlugins,
        '@babel/plugin-syntax-dynamic-import'
    ]
}
