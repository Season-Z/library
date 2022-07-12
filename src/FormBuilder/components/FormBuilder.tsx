/**
 * 通用表单组件
 */
import React, { useEffect, useMemo, useRef } from 'react';
import { Form, Row, Col } from 'antd';
import useMediaAntdQuery from 'use-media-antd-query';
import moment from 'moment';
import * as Fields2 from './Field';
import useSliderBtn from '../hooks/useSliderBtn';
import { handleNormalize } from '../utils/utils';
import { getValueInBlur, formItemLayoutType } from '../utils/constance';
import {
  defaultLayout,
  normalColLayout,
  fullColLayout,
} from '../utils/layouts';
import {
  DataListType,
  EleProps,
  FieldOpsProps,
  FormBuilderProps,
  FormFieldsType,
} from '../interface';
import '../index.less';

const { Item: FormItem } = Form;

type FieldsComponent = {
  [p in FormFieldsType]: (
    arg0: FieldOpsProps,
    arg1?: DataListType[],
  ) => JSX.Element;
};
const Fields: FieldsComponent = Fields2;

function FormBuilder<T extends Record<string, any>>(
  props: FormBuilderProps<T>,
) {
  const {
    elements: propsElement,
    notSearchForm,
    defaultExpand,
    formfieldsLength,
    useCache,
    leftElement,
    responsed,
    formRef,
    onSearch,
    onReset,
    ...antdFormProps
  } = props;
  const [form] = Form.useForm();
  const mediaSize = useMediaAntdQuery();

  // 是否第一次加载
  const didMount = useRef<boolean>(false);

  // 缓存的key
  const formStoreKey = `formbuilder-${window.location.href}`;

  const layoutType = normalColLayout;

  // 获取表单项list，以及搜索、重置按钮
  const [formfields, btnElement, dateFields] = useSliderBtn(
    propsElement,
    notSearchForm,
    defaultExpand,
    formfieldsLength,
  );

  // 可被重置表单项
  const canResetNames = useMemo(() => {
    const arr = propsElement.filter(ele =>
      ele.reset === undefined ? true : ele.reset,
    );
    return arr.map(e => e.name);
  }, [propsElement]);

  // 表单验证完成
  const onFinish = (values: T) => {
    if (onSearch) {
      onSearch(values);
    }
    // 如果是查询表单，缓存数据
    if (!notSearchForm && useCache) {
      window.localStorage.setItem(formStoreKey, JSON.stringify(values));
    }
  };

  // 重置表单
  const resetField = () => {
    form.resetFields(canResetNames);

    const values = form.getFieldsValue();
    if (onReset) {
      onReset(values);
    }
    // 如果是查询表单，缓存数据
    if (!notSearchForm && useCache) {
      window.localStorage.setItem(formStoreKey, JSON.stringify(values));
    }
  };

  // 计算按钮的布局
  const btnOffset = useMemo(() => {
    const span = layoutType[mediaSize];
    // 计算一行展示多少个表单项
    const rowLength = 24 / span;

    // 当按钮存在左侧内容时
    if (leftElement) {
      const offset = (rowLength - 1) * span;
      return offset;
    }

    // 获取所有展示出来的表单项占据的栅格数
    const length = formfields.reduce((pre: number, next: EleProps) => {
      const { hide, columns = 1 } = next;
      if (hide) return pre;
      // 当用户定义占据的栅格大于每行应该展示的表单项时，使用每行展示的表单项的值；避免造成栅格过多引起布局错乱
      const len = columns > rowLength ? rowLength : columns;

      return pre + len;
    }, 0);

    // 求余数，传入的表单项数量与每行展示的数量的余数；最后一行展示的数量
    const remainder = length % rowLength;
    const restLength = rowLength - remainder;
    const offset =
      remainder === 0 ? (rowLength - 1) * span : (restLength - 1) * span;

    return offset;
  }, [leftElement, layoutType, mediaSize, formfields]);

  // 设置不同模式的form布局
  const defaultFormLayout = useMemo(() => {
    const layout = antdFormProps?.layout || 'horizontal';
    return defaultLayout[layout];
  }, [antdFormProps?.layout]);

  // 表单排布，栅格布局渲染
  const renderLayout = (elements: any[]) => {
    return elements.map((ele, key) => {
      const { name, style, hide, columns = 1 } = ele.props;
      /**
       * 是否将本表单项设置为独占一行(row:24)的布局
       * 如果不是搜索表单且不是响应式表单，设置为每一项form占据一行
       */
      const shouldFull = notSearchForm && !responsed;

      let colLayout = {
        xxl: 6 * columns,
        xl: 6 * columns,
        lg: 6 * ((columns * 8) / 6),
        md: columns > 1 ? 24 : 12,
        sm: 24,
        xs: 24,
      };

      // 是否占据一行展示
      if (shouldFull) {
        colLayout = fullColLayout;
      }

      let fieldStyle: { [x: string]: string } = {};
      // 如果设置了 display:none，或设置了hide属性
      if ((style && style.display === 'none') || hide === 'true') {
        fieldStyle = { display: 'none' };
      }

      return (
        <Col
          key={name + key}
          {...colLayout}
          style={fieldStyle}
          className="col-item"
        >
          {ele}
        </Col>
      );
    });
  };

  //  渲染表单项
  const renderElement = (element: EleProps) => {
    const {
      fieldOptions,
      label,
      name,
      type,
      hide,
      columns,
      dataList,
      widget,
      ...rest
    } = element;
    // 设置校验的属性
    let rules = element.rules || [];
    if (element.required) {
      rules = [
        ...rules,
        {
          required: true,
          message: `${label}不能为空.`,
        },
      ];
    }

    // 校验时机
    const triggerInBlur: boolean = type ? getValueInBlur.includes(type) : false;

    const formItemProps = {
      ...rest,
      name,
      label,
      rules,
      key: name,
      hide: hide ? hide.toString() : 'false',
      validateTrigger: triggerInBlur ? 'onBlur' : 'onChange',
      columns,
      normalize: (val: string | number) => handleNormalize(val, type),
    };

    const cols = columns || 1;
    const formItemLayout = notSearchForm ? {} : formItemLayoutType[cols];

    if (type) {
      const options = { ...fieldOptions, label: label };

      return (
        <FormItem {...formItemLayout} {...formItemProps} fieldtype={type}>
          {Fields[type](options, dataList)}
        </FormItem>
      );
    }

    return (
      <FormItem {...formItemLayout} {...formItemProps}>
        {widget}
      </FormItem>
    );
  };

  // 读取缓存，赋值
  useEffect(() => {
    if (!useCache || didMount.current) {
      return;
    }
    const storeData: string | null = window.localStorage.getItem(formStoreKey);

    if (!storeData) {
      return;
    }
    try {
      const data = JSON.parse(storeData);
      // 将日期的表单项转为moment对象
      dateFields.forEach((v: EleProps) => {
        if (v.type === 'DATE_PICKER') {
          if (data[v.name]) {
            data[v.name] = moment(data[v.name]);
          }
        } else if (
          v.type === 'RANGE_PICKER' ||
          v.type === 'RANGE_PICKER_SHORT'
        ) {
          if (data[v.name]?.length > 0) {
            data[v.name] = [moment(data[v.name][0]), moment(data[v.name][1])];
          }
        }
      });

      form.setFieldsValue({ ...data });
    } catch (error) {
      console.log(`解析缓存数据失败：${error}`);
    }
  }, [dateFields, formStoreKey]);

  useEffect(() => {
    if (formRef) {
      // @ts-ignore
      formRef.current = form;
    }
  }, [formRef, form]);

  // 第一次加载结束后
  useEffect(() => {
    didMount.current = true;
  }, []);

  return (
    <div className="formBuilder">
      <Form
        {...defaultFormLayout}
        {...antdFormProps}
        form={form}
        onFinish={onFinish}
      >
        <Row gutter={24}>
          {renderLayout(formfields.map(renderElement))}
          {notSearchForm ? null : (
            <Col
              span={8}
              key="button"
              offset={btnOffset}
              {...normalColLayout}
              className="col-item"
            >
              <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                {(Fields as any)['SEARCH_BUTTON'](
                  resetField,
                  leftElement,
                  btnElement,
                )}
              </FormItem>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
}

export default FormBuilder;
