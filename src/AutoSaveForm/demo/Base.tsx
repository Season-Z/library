/**
 * title: 基本用法
 * desc: 最基本的功能
 */
import React from 'react';
import AutoSaveForm from '../index';
import { message } from 'antd';
import { EleProps } from '../../FormBuilder';

export default function() {
  const formfields: EleProps[] = [
    {
      label: 'input',
      name: 'input',
      type: 'INPUT', // 展示Input组件
      fieldOptions: {},
      required: true,
    },
    {
      label: 'select',
      name: 'select',
      type: 'SELECT',
      dataList: [
        // Select组件下拉框的值
        { value: '3', label: '已失效' },
        { value: '4', label: '已结束' },
      ],
      fieldOptions: {},
      required: true,
    },
    {
      label: 'range',
      name: 'range',
      type: 'RANGE_PICKER',
      fieldOptions: {
        // antd组件的原生api配置
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];

  // 必填项填完后的自动保存回调
  const saveFormCallback = async (fields: any) => {
    try {
      // 异步请求
      console.log(fields);
      return true;
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <AutoSaveForm saveFormCallback={saveFormCallback} elements={formfields} />
  );
}
