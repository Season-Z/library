/**
 * title: 自定义渲染表单项
 * desc: 自定义渲染表单控件、设置表单项的布局、设置表单项的样式
 */
import React from 'react';
import { Input, Row, Col } from 'antd';
import FormBuilder from '../index';
import { EleProps } from '../interface';

export default function() {
  const formfields: EleProps[] = [
    {
      label: 'field',
      name: 'sssdffd',
      widget: (
        <Input.Group size="large">
          <Row gutter={8}>
            <Col span={10}>
              <Input />
            </Col>
            <Col span={14}>
              <Input />
            </Col>
          </Row>
        </Input.Group>
      ),
    },
    {
      label: 'field',
      name: 'test',
      type: 'INPUT',
      // 设置该属性
      labelCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    },
  ];
  return <FormBuilder elements={formfields} />;
}
