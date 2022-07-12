import {
  FormEventHandler,
  MutableRefObject,
  ReactNode,
  RefObject,
} from 'react';
import { FormProps, FormInstance } from 'antd/lib/form';

export type FormFieldsType =
  | 'SELECT'
  | 'INPUT'
  | 'RANGE_PICKER'
  | 'DATE_PICKER'
  | 'TEXTAREA'
  | 'INPUT_NUMBER'
  | 'RADIO'
  | 'CHECKBOX_GROUP'
  | 'RANGE_PICKER_SHORT'
  | 'CASCADER';

export interface FormRefProps extends FormInstance {}

export interface DataListType {
  value: number | string;
  label: string;
  [x: string]: any;
}

export interface FieldOpsProps {
  [x: string]: any;
  label: any;
}

// antd 的FormItem一些属性
interface FormItemProps {
  dependencies?: string | number | (string | number)[];
  extra?: string | ReactNode; // 额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。
  getValueFromEvent?: (args: any[]) => any; // 设置如何将 event 的值转换成字段值
  getValueProps?: (value: any) => any; // 为子元素添加额外的属性
  hasFeedback?: boolean; // 配合 validateStatus 属性使用，展示校验状态图标，建议只配合 Input 组件使用
  help?: string | ReactNode; // 提示信息，如不设置，则会根据校验规则自动生成
  htmlFor?: string; // 设置子元素 label htmlFor 属性
  noStyle?: boolean; // 为 true 时不带样式，作为纯字段控件使用
  labelAlign?: 'left' | 'right'; // 标签文本对齐方式
  labelCol?: object; // 标签布局
  wrapperCol?: object;
  preserve?: boolean; // 当字段被删除时保留字段值
  normalize?: (arg0: any, arg1: any, arg2: any) => any; // 组件获取值后进行转换，再放入 Form 中
  shouldUpdate?: (arg0: any, arg1: any) => boolean | boolean;
  trigger?: string; // 设置收集字段值变更的时机
  validateFirst?: boolean | 'parallel'; // 当某一规则校验不通过时，是否停止剩下的规则的校验。设置 parallel 时会并行校验
  validateStatus?: string; // 校验状态，如不设置，则会根据校验规则自动生成，可选：'success' 'warning' 'error' 'validating'
  validateTrigger?: string | string[]; // 设置字段校验的时机
  valuePropName?: string; // 子节点的值的属性，如 Switch 的是 'checked'。该属性为 getValueProps 的封装，自定义 getValueProps 后会失效
  initialValue?: any;
}

export interface EleProps extends FormItemProps {
  name: string; // 控件的字段名
  label?: string | ReactNode; // 控件名
  rules?: Record<string, any>[]; // 控件的校验规则
  required?: boolean; // 控件是否必填
  widget?: ReactNode; // 控件
  isButton?: boolean; // 控件是否为按钮  无视参数
  type?: FormFieldsType; // 组件类型
  dataList?: DataListType[]; // 下拉框的枚举值
  fieldOptions?: Record<string, any>; // 组件的一些配置
  columns?: 1 | 2 | 3; // 占据几格
  hide?: boolean; // 隐藏该表单项，但是查询或表单提交时该表单项的值会带上
  reset?: boolean; // 可否被重置
}

/**
 * Formbuilder组件入参
 */
export interface FormBuilderProps<T extends Record<string, any>>
  extends FormProps<T> {
  elements: EleProps[];
  leftElement?: ReactNode | string; // 表单操作按钮左侧的内容
  onSearch?: (arg: any) => void; // 点击查询获取所有表单项值的回调
  notSearchForm?: boolean; // 设置表单是否为查询表单，类型（查询表单|新增编辑等录入表单）
  responsed?: boolean; // 是否为响应式表单
  onReset?: (arg: any) => void; // 表单重置的回调
  defaultExpand?: boolean; // 是否展示所有表单查询项
  formfieldsLength?: number; // 默认展示的表单项数量
  formRef?:
    | RefObject<FormInstance<T>>
    | MutableRefObject<FormInstance<T> | undefined>; // form实例
  useCache?: boolean; // 是否缓存
}
