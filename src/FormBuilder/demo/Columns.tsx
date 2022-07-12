import React from 'react';
import FormBuilder, { EleProps } from '../index';

export default function() {
  const formfields: EleProps[] = [
    {
      label: <div>sadadad</div>,
      name: 'input',
      type: 'INPUT', // 展示Input组件
      columns: 2,
      fieldOptions: {
        placeholder: 'sadadad',
      },
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
    },
    {
      label: 'inputNumber',
      name: 'inputNumber',
      type: 'INPUT_NUMBER',
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
    {
      label: 'date',
      name: 'date',
      type: 'DATE_PICKER',
    },
  ];

  return <FormBuilder elements={formfields} gutter={24} />;
}
