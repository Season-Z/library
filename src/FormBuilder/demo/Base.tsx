import React, { useCallback } from 'react';
import FormBuilder, { EleProps } from '../index';

export default function() {
  const formfields: EleProps[] = [
    {
      label: <div>sadadad</div>,
      name: 'input',
      type: 'INPUT', // 展示Input组件
      fieldOptions: {
        placeholder: 'sadadad',
      },
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
    },
    {
      label: 'range',
      name: 'range',
      type: 'RANGE_PICKER',
      columns: 2,
      fieldOptions: {
        // antd组件的原生api配置
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      label: 'inputNumber',
      name: 'inputNumber',
      type: 'INPUT_NUMBER',
    },
    {
      label: 'date',
      name: 'date',
      type: 'DATE_PICKER',
      fieldOptions: {},
      columns: 3,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    },
  ];

  // 点击查询的回调
  const searchHandler = useCallback(values => {
    console.log(values);
  }, []);

  const initialValues = {
    input: 'input',
    select: '3',
    range: [],
    date: undefined,
  };

  return (
    <FormBuilder
      elements={formfields}
      initialValues={initialValues}
      onSearch={searchHandler}
    />
  );
}
