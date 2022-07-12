/* eslint-disable no-unused-expressions */
import React, { useEffect, useRef, useState } from 'react';
import { Select, Input, DatePicker, TreeSelect, Switch, Cascader } from 'antd';
import moment from 'moment';
import { SelectValue } from 'antd/lib/select';
import { DataListType, FieldsProps } from '../interface';

const { RangePicker } = DatePicker;

/**
 * 下拉框控件
 */
export const EnSelect = (props: FieldsProps) => {
  const { fieldOptions, dataList = [], fieldChange, fieldValue } = props;
  const dataSource = dataList as DataListType[];

  const handleChange = (value: SelectValue, o: any) => {
    return fieldChange(value, o);
  };

  return (
    <Select
      showSearch
      dropdownMatchSelectWidth={false}
      value={fieldValue}
      filterOption={(input: string, option: any) =>
        option.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      {...fieldOptions}
      onChange={undefined}
      onSelect={handleChange}
      style={{ width: '100%' }}
    >
      {dataSource.map((item: any) => {
        const { value, label } = item;
        return (
          <Select.Option key={value} value={value} rows={item}>
            {label}
          </Select.Option>
        );
      })}
    </Select>
  );
};

/**
 * 输入框控件
 */
export const EnInput = (props: FieldsProps) => {
  const { fieldOptions, fieldChange, fieldValue, fieldCls } = props;
  const { formatter, ...rest } = fieldOptions || {};
  const inputRef = useRef<HTMLInputElement | any>(null);
  const [input, setInput] = useState<undefined | string | number>(fieldValue);

  useEffect(() => {
    setInput(fieldValue);
  }, [fieldValue]);

  // 失去焦点
  const save = () => {
    const val = input?.toString().trim();
    return fieldChange(val);
  };

  // 保存输入内容
  const changeField = (e: Event & any) => {
    let value: string = e.target.value;

    if (formatter) {
      value = formatter(value);
    }
    setInput(value);
  };

  const onFocus = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  return (
    <Input
      {...rest}
      className={fieldCls}
      ref={inputRef}
      value={input}
      onFocus={onFocus}
      onChange={changeField}
      onPressEnter={save}
      onBlur={save}
    />
  );
};

/**
 * 时间范围控件
 */
export const EnRangePicker = (props: FieldsProps) => {
  const { fieldOptions, fieldChange, fieldValue } = props;
  const format = fieldOptions?.format || 'YYYY-MM-DD';

  const value = Array.isArray(fieldValue) ? fieldValue : [];

  const defaultStart: any = fieldValue ? moment(value[0]) : undefined;
  const defaultEnd: any = fieldValue ? moment(value[1]) : undefined;

  const handleChange = (e: any) => {
    if (!e) {
      fieldChange(undefined);
      return;
    }
    const value = Array.isArray(e) ? e : [];
    const start = moment(value[0]).format(format);
    const end = moment(value[1]).format(format);

    fieldChange(`${start} - ${end}`);
  };

  return (
    <RangePicker
      allowClear
      autoFocus
      style={{ width: '100%' }}
      format={[format, format]}
      placeholder={['开始', '结束']}
      {...fieldOptions}
      value={[defaultStart, defaultEnd]}
      onChange={handleChange}
    />
  );
};

/**
 * 时间选择控件
 */
export const EnDatePicker = (props: FieldsProps) => {
  const { fieldOptions, fieldChange, fieldValue } = props;
  const format = fieldOptions?.fieldOptions || 'YYYY-MM-DD';
  const defaultValue = fieldValue ? moment(fieldValue) : undefined;

  const handleChange = (e: any) => {
    const data = moment(e).format(format);
    fieldChange(data);
  };

  return (
    <DatePicker
      allowClear
      autoFocus
      style={{ width: '100%' }}
      format={format}
      placeholder="请选择"
      {...fieldOptions}
      value={defaultValue}
      onChange={handleChange}
    />
  );
};

/**
 * 树结构选择
 */
export const EnSelectTree = (props: FieldsProps) => {
  const { fieldOptions, fieldChange, fieldValue } = props;

  const defaultValue = Array.isArray(fieldValue) ? fieldValue : [];
  const [selected, setSelected] = useState<Array<number | string | undefined>>(
    defaultValue,
  );

  const changeTreeSelect = (e: any) => {
    setSelected(e);
  };

  const handleSave = () => {
    fieldChange(selected);
  };

  return (
    <TreeSelect
      style={{ width: '100%' }}
      multiple
      placeholder="请选择"
      showSearch
      allowClear
      treeDataSimpleMode
      treeNodeFilterProp="title" // 开启按title搜索
      {...fieldOptions}
      defaultValue={fieldValue}
      onChange={changeTreeSelect}
      onBlur={handleSave}
    />
  );
};

/**
 * switch
 */
export const EnSwitch = (props: FieldsProps) => {
  const { fieldOptions, fieldChange, fieldValue } = props;
  const { formatter, ...rest } = fieldOptions || {};

  const checked = typeof fieldValue !== 'boolean' ? false : fieldValue;

  return <Switch {...rest} checked={checked} onChange={fieldChange} />;
};

/**
 * Cascader
 */
export const EnCascader = (props: FieldsProps) => {
  const { fieldOptions, dataList = [], fieldChange, fieldValue } = props;

  return (
    <Cascader
      {...fieldOptions}
      value={fieldValue}
      options={dataList}
      onChange={fieldChange}
    />
  );
};
