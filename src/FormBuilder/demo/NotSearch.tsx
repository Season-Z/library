import React, { useState } from 'react';
import { Radio, Checkbox } from 'antd';
import FormBuilder from '../index';
import { EleProps } from '../interface';
import { FormLayout } from 'antd/es/form/Form';

interface FormItemProps {
  input: string;
  select: string;
  range: any;
  date: any;
  textarea: string;
}

export default function() {
  const formfields: EleProps[] = [
    {
      label: 'input',
      name: 'input',
      type: 'INPUT', // 展示Input组件
      fieldOptions: {},
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
      fieldOptions: {},
    },
    {
      label: 'textarea',
      name: 'textarea',
      type: 'TEXTAREA',
      fieldOptions: {},
    },
  ];

  const [layout, setLayout] = useState<FormLayout | undefined>('horizontal');
  const [responsed, setResponsed] = useState(false);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Radio.Group
          value={layout}
          onChange={v => setLayout(v.target.value)}
          style={{ marginBottom: '16px' }}
        >
          <Radio.Button value="horizontal">horizontal</Radio.Button>
          <Radio.Button value="vertical">vertical</Radio.Button>
          <Radio.Button value="inline">inline</Radio.Button>
        </Radio.Group>
        <Checkbox
          checked={responsed}
          onChange={v => setResponsed(v.target.checked)}
        >
          是否响应式
        </Checkbox>
      </div>
      <FormBuilder<FormItemProps>
        elements={formfields}
        notSearchForm={true}
        responsed={responsed}
        formOptions={{
          layout,
          labelCol: {
            xs: { span: 6 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 18 },
            sm: { span: 18 },
          },
        }}
      />
    </div>
  );
}
