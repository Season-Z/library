/* eslint-disable no-empty-pattern */
/* eslint-disable react-@hooks/exhaustive-deps */
import React from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import ConfigProvider from 'antd/lib/config-provider'; // 需要结构赋值的方式引入
import 'antd/lib/config-provider/style/index.css';
import { IProps } from './interface';

// 一个值，在一个地方改
const YpConfigProvider: React.FC<IProps> = ({
  children,
  isEn = false,
  ...rest
}) => {
  // useEffect(() => {
  // }, []);
  return (
    <ConfigProvider locale={isEn ? enUS : zhCN} {...rest}>
      {children}
    </ConfigProvider>
  );
};

export default YpConfigProvider;
