import { ReactNode } from 'react';
import { trimWhitespaceFields } from './constance';

/**
 * 获取标题文案
 * @param label form 标题
 */
export function getLabelName(label: string | ReactNode | any) {
  return typeof label === 'string'
    ? label
    : label
    ? label.props.children
    : '控件';
}

/**
 * 去除用户输入造成的前后空格
 * @param value 当前控件输入的值
 * @param element 用户传入的当前表单项的配置的属性
 */
export function handleNormalize(value: string | number, type?: string) {
  if (!type || !trimWhitespaceFields.includes(type)) {
    return value;
  }

  if (typeof value === 'number') {
    return value;
  }
  if (value) {
    return value.replace(/(^\s*)|(\s*$)/g, '');
  }
}
