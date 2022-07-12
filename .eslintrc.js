//   // extends: [require.resolve('@umijs/fabric/dist/eslint')],
const base = require('./eslint-rules/base');
const react = require('./eslint-rules/react');
const ts = require('./eslint-rules/ts');

module.exports = {
  extends: ['alloy', 'alloy/react', 'alloy/typescript', 'prettier'],
  parser: '@typescript-eslint/parser',
  // can add plugins: '@typescript-eslint','babel',
  plugins: ['markdown', 'react', 'react-hooks'],
  settings: {
    react: {
      version: '16.9',
    },
  },
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    //
    browser: true,
    // REACT_APP_MY_ENV: String,
    // node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    //
    // myGlobal: false
  },
  rules: {
    ...base,
    ...react,
    ...ts,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-implicit-coercion': 'off', // 显示转换类型： +'9'
    '@typescript-eslint/no-duplicate-imports': 'off',
  },
};
