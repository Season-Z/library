/**
 * title: 业务里基本的联动操作
 * desc: 显示隐藏某个表单项，给某个表单项控件赋值
 */
import { FormInstance } from 'antd';
import React, { useRef, useState, useCallback } from 'react';
import FormBuilder from '../index';
import { EleProps } from '../interface';

export default function() {
  const formfields: EleProps[] = [
    {
      label: 'name',
      name: 'name',
      type: 'INPUT', // 展示Input组件
      fieldOptions: {},
    },
    {
      label: 'description',
      name: 'description',
      type: 'INPUT', // 展示Input组件
      fieldOptions: {},
      hide: true, // 隐藏该表单项
    },
    {
      label: 'memo',
      name: 'memo',
      type: 'SELECT',
      dataList: [
        { value: '3', label: '已失效' },
        { value: '4', label: '已结束' },
      ],
      fieldOptions: {},
    },
  ];

  // 可通过ref 获取Form的实例
  // 可在父组件（引入FormBuilder的组件）内使用antd form组件的方法
  const form = useRef<FormInstance>();
  const [fields, setFields] = useState(formfields);

  const changeForm = useCallback((field, allFields) => {
    // field:当前改变的表单项, allFields所有的表单数据
    // 也可通过匹配表单项字段名来触发异步请求的函数，动态渲染其他表单项(如Select组件的下拉数据)
    console.log(field, allFields);
    if (field['name']) {
      const list = fields.map(v => {
        if (v.name === 'description') {
          return Object.assign(v, { hide: false });
        }
        if (v.name === 'memo') {
          return Object.assign(v, { hide: true });
        }
        return v;
      });
      setFields(list);

      form.current?.setFieldsValue({
        description: 'hahaha',
      });
    }
  }, []);

  return <FormBuilder formRef={form} elements={fields} onChange={changeForm} />;
}
