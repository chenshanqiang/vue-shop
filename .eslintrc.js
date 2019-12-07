module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'eol-last': 0,
        'indent': 0,
        'spaced-comment': 0,
        'no-trailing-spaces': 0,
        'space-before-blocks': 0,
        'space-before-function-paren': 0,
        'comma-spacing': 0,
        'key-spacing': 0,
        'space-unary-ops': 0
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}