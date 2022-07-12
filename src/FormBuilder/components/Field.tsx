import React from 'react';
import {
  Select,
  Input,
  DatePicker,
  Radio,
  Button,
  InputNumber,
  Checkbox,
  Row,
  Col,
  Cascader,
} from 'antd';
import cls from 'classnames';
import { DataListType, FieldOpsProps } from '../interface';
import '../index.less';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

export const SEARCH_BUTTON = (
  resetField: () => void,
  leftElement: JSX.Element,
  btnElement: JSX.Element | null,
) => {
  return (
    <div className="optionBtns">
      <div className="ellipsis">{leftElement}</div>
      <Button
        type="primary"
        htmlType="submit"
        className={cls('mRight10', {
          mLeft16: !!leftElement,
        })}
      >
        查询
      </Button>
      <Button onClick={resetField} className="mRight10">
        重置
      </Button>
      {btnElement ? btnElement : null}
    </div>
  );
};

export const SELECT = (options: FieldOpsProps, dataSource?: DataListType[]) => {
  const { label, ...rest } = options;
  const fieldOpts = {
    allowClear: true,
    showSearch: true,
    filterOption: (input: string, option: any) =>
      option.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0,
    placeholder: `请选择${label}`,
    dropdownMatchSelectWidth: false,
    style: { width: '100%' },
    ...rest,
    options: dataSource || [],
  };
  return <Select {...fieldOpts} />;
};

export const INPUT = (options: FieldOpsProps) => {
  const { label, ...rest } = options;
  return <Input placeholder={`请输入${label}`} allowClear {...rest} />;
};

export const TEXTAREA = (options: FieldOpsProps) => {
  const { label, ...rest } = options;
  return (
    <TextArea placeholder={`请输入${label}`} allowClear autoSize {...rest} />
  );
};

export const RANGE_PICKER = (options: FieldOpsProps) => {
  return <RangePicker allowClear style={{ width: '100%' }} {...options} />;
};

export const DATE_PICKER = (options: FieldOpsProps) => {
  return <DatePicker allowClear style={{ width: '100%' }} {...options} />;
};

/**
 * 简短的日期范围选择组件
 */
export const RANGE_PICKER_SHORT = (options: FieldOpsProps) => {
  return (
    <RangePicker
      allowClear
      style={{ width: '100%' }}
      {...options}
      showTime={false}
      className="shortPangePicker"
      suffixIcon={null}
    />
  );
};

export const RADIO = (options: FieldOpsProps, dataSource?: DataListType[]) => {
  return (
    <Radio.Group {...options}>
      {dataSource &&
        dataSource.map((val, key) => {
          const optKey = val.key ?? val.value ?? key;
          return (
            <Radio value={optKey} key={optKey}>
              {val.label}
            </Radio>
          );
        })}
    </Radio.Group>
  );
};

export const INPUT_NUMBER = (options: FieldOpsProps) => {
  const { label, ...rest } = options;

  return <InputNumber style={{ width: '100%' }} {...rest} />;
};

export const CHECKBOX_GROUP = (
  options: FieldOpsProps,
  dataSource?: DataListType[],
) => {
  return (
    <Checkbox.Group {...options}>
      <Row>
        {dataSource &&
          dataSource.map((val, k) => {
            return (
              <Col key={val.value ?? k}>
                <Checkbox value={val.value}>{val.label}</Checkbox>
              </Col>
            );
          })}
      </Row>
    </Checkbox.Group>
  );
};

export const CASCADER = (
  options: FieldOpsProps,
  dataSource?: DataListType[],
) => {
  return <Cascader allowClear {...options} options={dataSource} />;
};
