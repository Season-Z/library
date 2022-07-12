import { defineConfig } from 'dumi';
import path from 'path';
const resolvePath = dir => path.join(__dirname, dir);

export default defineConfig({
  title: 'yp-frontend-library',
  description: '谊品中台前端业务组件库',
  // theme: {
  //   '@primary-color': '#A14EFF',
  //   '@link-color': '#A14EFF',
  //   '@font-family': '"futura-pt", sans-serif',
  //   '@line-height-base': '1.3',
  //   '@border-radius-base': '6px',
  // },
  outputPath: 'dist',
  mode: 'site',
  define: {
    REACT_APP_MY_ENV: process.env.REACT_APP_MY_ENV,
  },
  alias: {
    'yp-frontend-library': resolvePath('src'),
    '@src': resolvePath('src'),
    '@utils': resolvePath('utils'),
    '@typings': resolvePath('typings'),
    hooks: resolvePath('src/hooks'),
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  ignoreMomentLocale: true,
  menus: {
    '/hooks': [
      {
        title: '关于hook',
        children: ['hooks.md'],
      },
      {
        title: '工具',
        children: [
          'hooks/useTimer',
          'hooks/useRefCallback',
          'hooks/useCompareEffect',
          'hooks/useCompareMemo',
        ],
      },
      {
        title: '业务相关',
        children: ['hooks/useLoopImport', 'hooks/useNewNameDownload'],
      },
    ],
    '/components': [
      {
        title: '概要',
        children: ['components.md'],
      },
      {
        title: '布局',
        children: [
          'EnhanceTable',
          'FormBuilder',
          'AutoSaveForm',
          'DropdownMenu',
          'PortalLayout',
          'WrapperLayout',
        ],
      },
      {
        title: '工具',
        children: ['YpRequest', 'YpConfigProvider'],
      },
    ],
  },
});
