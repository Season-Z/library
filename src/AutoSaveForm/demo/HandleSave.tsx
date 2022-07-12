/**
 * title: 复杂表单项保存
 * desc: 一些复杂的表单项，Antd的Form获取不到组件的值，需要手动赋值。通过拿到 `AutoSaveForm` 的实例，用实例上的 `handleSaveData` 方法进行保存
 */
import React, { useCallback, useRef } from 'react';
import AutoSaveForm from '../index';
import { message, Input } from 'antd';
import { EleProps } from '../../FormBuilder';
import { AutoFormRefProps } from '../interface';

export default function() {
  const autoFormRef = useRef<AutoFormRefProps>(null);

  const handleChange1 = useCallback((e: { target: { value: any } }) => {
    const value = e.target.value;
    autoFormRef.current?.handleSaveData({ cpmplexCustom1: value });
  }, []);

  const handleChange2 = useCallback((e: { target: { value: any } }) => {
    const value = e.target.value;
    autoFormRef.current?.handleSaveData({ cpmplexCustom2: value });
  }, []);

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

  const formfields: EleProps[] = [
    {
      label: 'input',
      name: 'input',
      type: 'INPUT', // 展示Input组件
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
      label: '自定义',
      name: 'custom',
      widget: <Input placeholder="自定义" />,
    },
    {
      label: '复杂自定义',
      name: 'cpmplexCustom1',
      required: true,
      widget: (
        <Input.Group>
          <Input
            placeholder="one"
            style={{ width: '50%' }}
            onChange={handleChange1}
          />
          <Input
            placeholder="two"
            style={{ width: '50%' }}
            onChange={handleChange2}
          />
        </Input.Group>
      ),
    },
    {
      label: '复杂自定义2',
      name: 'cpmplexCustom2',
      type: 'INPUT',
      required: true,
      hide: true,
    },
  ];

  return (
    <AutoSaveForm
      autoFormRef={autoFormRef}
      saveFormCallback={saveFormCallback}
      elements={formfields}
    />
  );
}
